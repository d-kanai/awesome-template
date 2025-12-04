package com.example.demo.shared.logging;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * メソッドにDB更新ログを出力することを示すアノテーション.
 *
 * <p>このアノテーションが付与されたメソッドはAOPでインターセプトされ、 DomainModelの変更内容がログに出力される。
 *
 * @see DbRecordUpdateLogAspect
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface DbRecordUpdateLog {}
