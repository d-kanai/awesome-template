package com.example.demo.modules.user.presentation.controller;

import com.example.demo.modules.user.application.command.DeleteUserCommand;
import com.example.demo.modules.user.application.command.SignupCommand;
import com.example.demo.modules.user.application.command.UpdateUserProfileCommand;
import com.example.demo.modules.user.application.query.FindAllUsersQuery;
import com.example.demo.modules.user.application.query.FindUserByEmailQuery;
import com.example.demo.modules.user.application.query.FindUserByIdQuery;
import com.example.demo.modules.user.domain.model.User;
import com.example.demo.modules.user.domain.value_object.UserId;
import com.example.demo.modules.user.presentation.input.SignupInput;
import com.example.demo.modules.user.presentation.input.UpdateUserProfileInput;
import com.example.demo.modules.user.presentation.output.FindAllUsersOutput;
import com.example.demo.modules.user.presentation.output.FindUserByEmailOutput;
import com.example.demo.modules.user.presentation.output.FindUserByIdOutput;
import com.example.demo.modules.user.presentation.output.SignupOutput;
import com.example.demo.modules.user.presentation.output.UpdateUserProfileOutput;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "ユーザー", description = "ユーザーを管理するための操作です")
@RestController
@RequestMapping(value = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserController {
    private final SignupCommand signupCommand;
    private final UpdateUserProfileCommand updateUserProfileCommand;
    private final DeleteUserCommand deleteUserCommand;
    private final FindAllUsersQuery findAllUsersQuery;
    private final FindUserByIdQuery findUserByIdQuery;
    private final FindUserByEmailQuery findUserByEmailQuery;

    public UserController(final SignupCommand signupCommand, final UpdateUserProfileCommand updateUserProfileCommand,
                          final DeleteUserCommand deleteUserCommand, final FindAllUsersQuery findAllUsersQuery,
                          final FindUserByIdQuery findUserByIdQuery, final FindUserByEmailQuery findUserByEmailQuery) {
        this.signupCommand = signupCommand;
        this.updateUserProfileCommand = updateUserProfileCommand;
        this.deleteUserCommand = deleteUserCommand;
        this.findAllUsersQuery = findAllUsersQuery;
        this.findUserByIdQuery = findUserByIdQuery;
        this.findUserByEmailQuery = findUserByEmailQuery;
    }

    @Operation(
        summary = "ユーザー一覧を取得",
        description = "登録されているすべてのユーザーを取得します。",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "ユーザーの取得に成功しました。",
                content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = FindAllUsersOutput.class)
                )
            )
        }
    )
    @GetMapping
    public ResponseEntity<FindAllUsersOutput> getAllUsers() {
        final List<User> users = findAllUsersQuery.execute();
        return ResponseEntity.ok(FindAllUsersOutput.from(users));
    }

    @Operation(
        summary = "ID でユーザーを取得",
        description = "指定した識別子のユーザーを取得します。"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "ユーザーが見つかりました。",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = FindUserByIdOutput.class)
            )
        ),
        @ApiResponse(responseCode = "400", description = "ユーザー識別子が不正です。", content = @Content),
        @ApiResponse(responseCode = "404", description = "ユーザーが見つかりません。", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<FindUserByIdOutput> getUserById(
        @Parameter(description = "ユーザーの識別子", example = "2b6a4f95-4ddc-4af1-9f79-a6b3a9e3e1d4")
        @PathVariable final String id
    ) {
        try {
            final UserId userId = UserId.fromString(id);
            return findUserByIdQuery.execute(userId)
                .map(FindUserByIdOutput::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (final IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(
        summary = "メールアドレスでユーザーを取得",
        description = "指定したメールアドレスのユーザーを取得します。"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "ユーザーが見つかりました。",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = FindUserByEmailOutput.class)
            )
        ),
        @ApiResponse(responseCode = "404", description = "ユーザーが見つかりません。", content = @Content)
    })
    @GetMapping("/email/{email}")
    public ResponseEntity<FindUserByEmailOutput> getUserByEmail(
        @Parameter(description = "ユーザーのメールアドレス", example = "jane.doe@example.com")
        @PathVariable final String email
    ) {
        return findUserByEmailQuery.execute(email)
            .map(FindUserByEmailOutput::from)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
        summary = "ユーザーを登録",
        description = "指定した情報で新しいユーザーを作成します。"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "ユーザーの作成に成功しました。",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = SignupOutput.class)
            )
        ),
        @ApiResponse(responseCode = "400", description = "リクエストペイロードが不正です。", content = @Content)
    })
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SignupOutput> signup(@RequestBody final SignupInput input) {
        try {
            final User user = signupCommand.execute(input);
            return ResponseEntity.status(HttpStatus.CREATED).body(SignupOutput.from(user));
        } catch (final IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(
        summary = "ユーザーを更新",
        description = "既存ユーザーのメールアドレスまたは氏名を更新します。"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "ユーザーの更新に成功しました。",
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = UpdateUserProfileOutput.class)
            )
        ),
        @ApiResponse(responseCode = "400", description = "リクエストペイロードまたは識別子が不正です。", content = @Content)
    })
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UpdateUserProfileOutput> updateUserProfile(
        @Parameter(description = "ユーザーの識別子", example = "2b6a4f95-4ddc-4af1-9f79-a6b3a9e3e1d4")
        @PathVariable final String id,
        @RequestBody final UpdateUserProfileInput input
    ) {
        try {
            final UserId userId = UserId.fromString(id);
            final User user = updateUserProfileCommand.execute(userId, input);
            return ResponseEntity.ok(UpdateUserProfileOutput.from(user));
        } catch (final IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(
        summary = "ユーザーを削除",
        description = "指定した識別子のユーザーを削除します。"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "ユーザーの削除に成功しました。", content = @Content),
        @ApiResponse(responseCode = "400", description = "ユーザー識別子が不正です。", content = @Content),
        @ApiResponse(responseCode = "404", description = "ユーザーが見つかりません。", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
        @Parameter(description = "ユーザーの識別子", example = "2b6a4f95-4ddc-4af1-9f79-a6b3a9e3e1d4")
        @PathVariable final String id
    ) {
        final UserId userId;
        try {
            userId = UserId.fromString(id);
        } catch (final IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }

        try {
            deleteUserCommand.execute(userId);
            return ResponseEntity.noContent().build();
        } catch (final IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
