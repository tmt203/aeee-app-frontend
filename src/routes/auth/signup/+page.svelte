<script lang="ts">
	import { apiPostRegister } from "@api/auth.api";
	import { Button, InputForm } from "@components/shared/molecules";
	import { generateToast } from "@constants/toast.constants";
	import { getToastStore } from "@skeletonlabs/skeleton";
	import type { RegisterBody } from "@type/api/auth.type";
	import { createForm } from "svelte-forms-lib";
	import { t } from "svelte-i18n";
	import { object, ref, string } from "yup";

	const toastStore = getToastStore();

	const initialValues = {
		first_name: "",
		last_name: "",
		username: "",
		email: "",
		password: "",
		confirm_password: ""
	};
	const validationSchema = object({
		first_name: string()
			.required($t("error.input_required"))
			.trim()
			.max(50, $t("error.max", { values: { field: "First Name", value: 50 } })),

		last_name: string()
			.required($t("error.input_required"))
			.trim()
			.max(50, $t("error.max", { values: { field: "Last Name", value: 50 } })),

		username: string()
			.required($t("error.input_required"))
			.trim()
			.min(3, $t("error.min", { values: { field: "Username", value: 3 } }))
			.max(30, $t("error.max", { values: { field: "Username", value: 30 } })),

		email: string()
			.required($t("error.input_required"))
			.email($t("error.email_invalid"))
			.lowercase(),

		password: string()
			.required($t("error.input_required"))
			.min(8, $t("error.min", { values: { field: "Password", value: 8 } })),

		confirm_password: string()
			.required($t("error.input_required"))
			.oneOf([ref("password")], $t("error.password_mismatch"))
	});
	const { form, errors, isSubmitting, handleSubmit } = createForm({
		initialValues,
		validationSchema,
		onSubmit: async (values) => {
			const body: RegisterBody = {
				...values
			};
			await handleRegister(body);
		}
	});

	let serverError: string = "";

	/**
	 * Handle register
	 * @param body RegisterBody
	 */
	const handleRegister = async (body: RegisterBody) => {
		// Reset server error
		serverError = "";

		try {
			const response = await apiPostRegister(body);

			if (response.code !== "OK") {
				serverError = response.message;
				return;
			}

			toastStore.trigger(
				generateToast("success", {
					message: $t("auth.register_success"),
					timeout: 5000
				})
			);
		} catch (error) {
			console.log(error);
		}
	};
</script>

<form class="flex w-full flex-col gap-4" on:submit|preventDefault={handleSubmit}>
	<!-- Area: Title -->
	<h1 class="mb-4 text-center text-2xl font-semibold text-slate-700">
		{$t("auth.create_account")}
	</h1>

	<!-- Area: First & Last Name -->
	<div class="flex items-start justify-between gap-4">
		<InputForm
			id="first_name"
			name="first_name"
			direction="column"
			label="First Name"
			type="text"
			placeholder="John"
			class="[&_.input-form-wrapper]:w-full"
			errorMessage={$errors.first_name}
			showErrorMessage
			bind:value={$form.first_name}
		/>

		<InputForm
			id="last_name"
			name="last_name"
			direction="column"
			label="Last Name"
			type="text"
			placeholder="Doe"
			class="[&_.input-form-wrapper]:w-full"
			errorMessage={$errors.last_name}
			showErrorMessage
			bind:value={$form.last_name}
		/>
	</div>

	<!-- Area: Username -->
	<InputForm
		id="username"
		name="username"
		direction="column"
		label="Username"
		type="text"
		placeholder="johndoe"
		class="[&_.input-form-wrapper]:w-full"
		errorMessage={$errors.username}
		showErrorMessage
		bind:value={$form.username}
	/>

	<!-- Area: Email -->
	<InputForm
		id="email"
		name="email"
		direction="column"
		label="Email"
		type="email"
		placeholder="email@address.com"
		class="[&_.input-form-wrapper]:w-full"
		errorMessage={$errors.email}
		showErrorMessage
		bind:value={$form.email}
	/>

	<!-- Area: Password -->
	<InputForm
		id="password"
		name="password"
		direction="column"
		label="Password"
		type="password"
		placeholder="********"
		class="[&_.input-form-wrapper]:w-full"
		errorMessage={$errors.password}
		showErrorMessage
		bind:value={$form.password}
	/>

	<!-- Area: Confirm Password -->
	<InputForm
		id="confirm_password"
		name="confirm_password"
		direction="column"
		label="Confirm Password"
		type="password"
		placeholder="********"
		class="[&_.input-form-wrapper]:w-full"
		errorMessage={$errors.confirm_password}
		showErrorMessage
		bind:value={$form.confirm_password}
	/>

	<!-- Area: Error Message From Server -->
	{#if serverError}
		<p class="mt-2 text-sm text-red-600">{serverError}</p>
	{/if}

	<!-- Area: Submit Button -->
	<Button type="submit" label={$t("auth.signup")} isLoading={$isSubmitting} class="mt-3" />

	<div class="mx-auto">
		<p class="text-sm text-slate-400">
			{$t("auth.already_have_account")}
			<a href="/auth/signin" class="text-sm text-primary-500 transition-opacity hover:opacity-80">
				{$t("auth.sign_in_here")}
			</a>
		</p>
	</div>
</form>
