package com.example.demo.features.user.internal.presentation.job;

import static net.logstash.logback.argument.StructuredArguments.kv;

import com.example.demo.features.user.internal.domain.repository.UserRepository;
import com.example.demo.shared.job.Job;
import com.example.demo.shared.logging.AppLogger;
import jakarta.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component("userStatsSummary")
public class UserStatsSummaryJob implements Job<UserStatsSummaryJob.Args> {

  private static final Logger log = LoggerFactory.getLogger(UserStatsSummaryJob.class);

  private final UserRepository userRepository;
  private final AppLogger appLogger;

  public UserStatsSummaryJob(final UserRepository userRepository, final AppLogger appLogger) {
    this.userRepository = userRepository;
    this.appLogger = appLogger;
  }

  public record Args(@NotNull Boolean dryRun, @NotNull String targetDate) implements Job.Args {}

  @Override
  public void execute(final Args args) {
    final long totalUsers = userRepository.count();
    log.info(
        "User stats summary",
        kv("log_type", "job_result"),
        kv("env", appLogger.env()),
        kv("timestamp", appLogger.now()),
        kv("job_name", "userStatsSummary"),
        kv("total_users", totalUsers),
        kv("target_date", args.targetDate()),
        kv("dry_run", args.dryRun()));
  }
}
