package com.example.demo.shared.job;

import jakarta.validation.constraints.NotNull;

public interface Job<T extends Job.Args> {

  /** 全Jobで必須の共通引数. */
  interface Args {
    @NotNull
    Boolean dryRun();
  }

  void execute(T args);
}
