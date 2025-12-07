package com.example.demo.shared.job;

import com.example.demo.shared.logging.AppLogger;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import java.lang.reflect.Constructor;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.RecordComponent;
import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.jspecify.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@SuppressFBWarnings(
    value = "DM_EXIT",
    justification = "System.exit is intentional for CLI job execution")
public class JobRunner implements ApplicationRunner {

  private static final Logger log = LoggerFactory.getLogger(JobRunner.class);

  private final Map<String, Job<?>> jobs;
  private final AppLogger appLogger;
  private final Validator validator;

  public JobRunner(
      final Map<String, Job<?>> jobs, final AppLogger appLogger, final Validator validator) {
    this.jobs = jobs;
    this.appLogger = appLogger;
    this.validator = validator;
  }

  @Override
  public void run(final ApplicationArguments args) throws Exception {
    if (!args.containsOption("job")) {
      return;
    }

    final List<String> jobNames = args.getOptionValues("job");
    if (jobNames == null || jobNames.isEmpty()) {
      log.error("Job name is required. Usage: --job=<jobName>");
      System.exit(1);
      return;
    }

    final String jobName = jobNames.get(0);
    final Job<?> job = jobs.get(jobName);

    if (job == null) {
      log.error("Job not found: {}. Available jobs: {}", jobName, jobs.keySet());
      System.exit(1);
      return;
    }

    try {
      runJob(job, jobName, args);
      System.exit(0);
    } catch (final Exception e) {
      // エラーログは runJob 内で出力済み
      System.exit(1);
    }
  }

  @SuppressWarnings("unchecked")
  private <T extends Job.Args> void runJob(
      final Job<T> job, final String jobName, final ApplicationArguments appArgs) {
    final Class<T> argsClass = (Class<T>) resolveArgsClass(job.getClass());
    final T args = parseArgs(appArgs, argsClass);

    validateArgs(args, jobName);

    final long startTime = System.currentTimeMillis();

    appLogger.logJobStart(job.getClass(), jobName, args);
    try {
      job.execute(args);
      final long durationMs = System.currentTimeMillis() - startTime;
      appLogger.logJobComplete(job.getClass(), jobName, durationMs);
    } catch (final Exception e) {
      final long durationMs = System.currentTimeMillis() - startTime;
      appLogger.logJobError(job.getClass(), jobName, e, durationMs);
      throw e;
    }
  }

  private <T extends Job.Args> void validateArgs(final T args, final String jobName) {
    final Set<ConstraintViolation<T>> violations = validator.validate(args);
    if (!violations.isEmpty()) {
      final String errorMessage =
          violations.stream()
              .map(v -> v.getPropertyPath() + ": " + v.getMessage())
              .collect(Collectors.joining(", "));
      log.error("Job {} has invalid args: {}", jobName, errorMessage);
      System.exit(1);
    }
  }

  private Class<?> resolveArgsClass(final Class<?> jobClass) {
    for (final Type type : jobClass.getGenericInterfaces()) {
      if (type instanceof ParameterizedType pt && pt.getRawType() == Job.class) {
        return (Class<?>) pt.getActualTypeArguments()[0];
      }
    }
    throw new IllegalStateException("Could not resolve Args type for: " + jobClass.getName());
  }

  private <T> T parseArgs(final ApplicationArguments appArgs, final Class<T> argsClass) {
    if (!argsClass.isRecord()) {
      throw new IllegalStateException("Args type must be a record: " + argsClass.getName());
    }

    final RecordComponent[] components = argsClass.getRecordComponents();
    final Object[] values = new Object[components.length];
    final Class<?>[] types = new Class<?>[components.length];

    for (int i = 0; i < components.length; i++) {
      final RecordComponent component = components[i];
      final String name = component.getName();
      final Class<?> type = component.getType();
      types[i] = type;
      values[i] = parseValue(getOptionValue(appArgs, name), type);
    }

    try {
      final Constructor<T> constructor = argsClass.getDeclaredConstructor(types);
      return constructor.newInstance(values);
    } catch (final Exception e) {
      throw new IllegalArgumentException("Failed to parse args for " + argsClass.getName(), e);
    }
  }

  private @Nullable Object parseValue(final @Nullable String value, final Class<?> type) {
    if (value == null) {
      return getDefaultValue(type);
    }

    if (type == String.class) {
      return value;
    } else if (type == int.class || type == Integer.class) {
      return Integer.parseInt(value);
    } else if (type == long.class || type == Long.class) {
      return Long.parseLong(value);
    } else if (type == boolean.class || type == Boolean.class) {
      return Boolean.parseBoolean(value);
    } else if (type == LocalDate.class) {
      return LocalDate.parse(value);
    } else if (type == LocalDateTime.class) {
      return LocalDateTime.parse(value);
    }

    throw new IllegalArgumentException("Unsupported type: " + type.getName());
  }

  private @Nullable Object getDefaultValue(final Class<?> type) {
    if (type == boolean.class) {
      return false;
    } else if (type == int.class) {
      return 0;
    } else if (type == long.class) {
      return 0L;
    }
    return null;
  }

  private @Nullable String getOptionValue(final ApplicationArguments args, final String name) {
    final List<String> values = args.getOptionValues(name);
    return (values != null && !values.isEmpty()) ? values.get(0) : null;
  }
}
