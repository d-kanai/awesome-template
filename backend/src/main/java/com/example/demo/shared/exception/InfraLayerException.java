package com.example.demo.shared.exception;

/** Infrastructure層で発生するエラー. */
public class InfraLayerException extends RuntimeException {

  public InfraLayerException(final String message) {
    super(message);
  }
}
