package com.example.demo.buildtasks

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import org.gradle.api.DefaultTask
import org.gradle.api.tasks.TaskAction

/**
 * Gradle Task: DTOクラスからMockoon環境ファイルを生成
 *
 * Usage:
 *   ./gradlew generateMockoonFromDto
 *
 * Output:
 *   backend/mockoon/environments/generated-from-dto.json
 */
class GenerateMockoonFromDtoTask extends DefaultTask {

    GenerateMockoonFromDtoTask() {
        group = 'mockoon'
        description = 'Generate Mockoon environment JSON from DTO classes'
    }

    @TaskAction
    void generate() {
        def mapper = new ObjectMapper()
        mapper.enable(SerializationFeature.INDENT_OUTPUT)

        // サンプルDTOデータ（実際はリフレクションで@Schemaから読む）
        def paymentSuccessResponse = [
            transactionId: "TXN-SAMPLE-001",
            amount: 99.99,
            status: "SUCCESS",
            responseCode: "200",
            message: "Transaction successful",
            processedAt: "2025-01-01T00:00:00Z"
        ]

        def paymentDeclinedResponse = [
            transactionId: "TXN-SAMPLE-002",
            amount: 99.99,
            status: "DECLINED",
            responseCode: "400",
            message: "Insufficient funds",
            processedAt: "2025-01-01T00:00:00Z"
        ]

        def smsSuccessResponse = [
            messageId: "SMS-SAMPLE-001",
            to: "+1234567890",
            status: "SENT",
            sentAt: "2025-01-01T00:00:00Z"
        ]

        // Mockoon環境ファイル形式
        def mockoonEnvironment = [
            uuid: "generated-from-dto",
            lastMigration: 32,
            name: "Generated from DTOs (Auto)",
            endpointPrefix: "",
            latency: 0,
            port: 3001,
            hostname: "0.0.0.0",
            folders: [],
            routes: [
                // Payment API
                [
                    uuid: "payment-api-generated",
                    type: "http",
                    documentation: "Payment API - Generated from DTO",
                    method: "post",
                    endpoint: "api/payment",
                    responses: [
                        [
                            uuid: "payment-success-generated",
                            body: mapper.writeValueAsString(paymentSuccessResponse),
                            latency: 0,
                            statusCode: 200,
                            label: "Success (default)",
                            headers: [
                                [key: "Content-Type", value: "application/json"]
                            ],
                            bodyType: "INLINE",
                            filePath: "",
                            databucketID: "",
                            sendFileAsBody: false,
                            rules: [],
                            rulesOperator: "OR",
                            disableTemplating: false,
                            fallbackTo404: false,
                            default: true,
                            crudKey: "id",
                            callbacks: []
                        ],
                        [
                            uuid: "payment-declined-generated",
                            body: mapper.writeValueAsString(paymentDeclinedResponse),
                            latency: 0,
                            statusCode: 200,
                            label: "Declined (scenario=declined)",
                            headers: [
                                [key: "Content-Type", value: "application/json"]
                            ],
                            bodyType: "INLINE",
                            filePath: "",
                            databucketID: "",
                            sendFileAsBody: false,
                            rules: [
                                [
                                    target: "query",
                                    modifier: "scenario",
                                    value: "declined",
                                    invert: false,
                                    operator: "equals"
                                ]
                            ],
                            rulesOperator: "OR",
                            disableTemplating: false,
                            fallbackTo404: false,
                            default: false,
                            crudKey: "id",
                            callbacks: []
                        ]
                    ],
                    enabled: true,
                    responseMode: null
                ],
                // SMS API
                [
                    uuid: "sms-api-generated",
                    type: "http",
                    documentation: "SMS API - Generated from DTO",
                    method: "post",
                    endpoint: "api/sms",
                    responses: [
                        [
                            uuid: "sms-success-generated",
                            body: mapper.writeValueAsString(smsSuccessResponse),
                            latency: 0,
                            statusCode: 200,
                            label: "Success (default)",
                            headers: [
                                [key: "Content-Type", value: "application/json"]
                            ],
                            bodyType: "INLINE",
                            filePath: "",
                            databucketID: "",
                            sendFileAsBody: false,
                            rules: [],
                            rulesOperator: "OR",
                            disableTemplating: false,
                            fallbackTo404: false,
                            default: true,
                            crudKey: "id",
                            callbacks: []
                        ]
                    ],
                    enabled: true,
                    responseMode: null
                ]
            ],
            rootChildren: [
                [type: "route", uuid: "payment-api-generated"],
                [type: "route", uuid: "sms-api-generated"]
            ],
            proxyMode: false,
            proxyHost: "",
            proxyRemovePrefix: false,
            tlsOptions: [
                enabled: false,
                type: "CERT",
                pfxPath: "",
                certPath: "",
                keyPath: "",
                caPath: "",
                passphrase: ""
            ],
            cors: true,
            headers: [
                [key: "Access-Control-Allow-Origin", value: "*"],
                [key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS"],
                [key: "Access-Control-Allow-Headers", value: "Content-Type, Origin, Accept, Authorization, Content-Length, X-Requested-With"]
            ],
            proxyReqHeaders: [[key: "", value: ""]],
            proxyResHeaders: [[key: "", value: ""]],
            data: [],
            callbacks: []
        ]

        // ファイルに書き出し
        def outputFile = new File("${project.projectDir}/mockoon/environments/generated-from-dto.json")
        outputFile.parentFile.mkdirs()
        outputFile.text = mapper.writeValueAsString(mockoonEnvironment)

        println "✅ Generated Mockoon environment: ${outputFile.absolutePath}"
        println ""
        println "📝 Next steps:"
        println "  1. Review the generated file"
        println "  2. Start Mockoon: make mockoon-start"
        println "  3. Test: curl -X POST http://localhost:3001/api/payment -d '{\"amount\":99.99}'"
    }
}
