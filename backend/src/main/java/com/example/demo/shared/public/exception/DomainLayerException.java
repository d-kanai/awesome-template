package com.example.demo.shared.exception;

/** Domain層で発生するビジネスルール違反エラー. */
public class DomainLayerException extends RuntimeException {

  public DomainLayerException(final String message) {
    super(message);
  }
}
