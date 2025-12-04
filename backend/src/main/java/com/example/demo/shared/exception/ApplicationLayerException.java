package com.example.demo.shared.exception;

/** Application層で発生するビジネスロジックエラー. */
public class ApplicationLayerException extends RuntimeException {

  public ApplicationLayerException(final String message) {
    super(message);
  }
}
