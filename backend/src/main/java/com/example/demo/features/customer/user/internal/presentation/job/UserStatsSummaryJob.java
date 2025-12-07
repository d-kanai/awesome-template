package com.example.demo.features.customer.user.internal.presentation.job;

import com.example.demo.features.customer.user.internal.domain.repository.UserRepository;
import com.example.demo.shared.job.Job;
import jakarta.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component("userStatsSummary")
public class UserStatsSummaryJob implements Job<UserStatsSummaryJob.Args> {

  private static final Logger log = LoggerFactory.getLogger(UserStatsSummaryJob.class);

  private final UserRepository userRepository;

  public UserStatsSummaryJob(final UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public record Args(@NotNull Boolean dryRun, @NotNull String targetDate) implements Job.Args {}

  @Override
  public void execute(final Args args) {
    final long totalUsers = userRepository.count();
    log.info(
        "User stats summary: totalUsers={}, targetDate={}, dryRun={}",
        totalUsers,
        args.targetDate(),
        args.dryRun());
  }
}
