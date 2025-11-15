<script lang="ts">
	import { deserialize } from "$app/forms";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { Checkbox } from "@components/shared/atoms";
	import { Button, InputForm } from "@components/shared/molecules";
	import { generateToast } from "@constants/toast.constants";
	import { getToastStore } from "@skeletonlabs/skeleton";
	import type { LoginBody } from "@type/api/auth.type";
	import type { AppServerResponse } from "@type/app-server";
	import { onMount } from "svelte";
	import { createForm } from "svelte-forms-lib";
	import { t } from "svelte-i18n";
	import { object, string } from "yup";

	const toastStore = getToastStore();

	const initialValues = {
		identifier: "",
		password: ""
	};
	const validationSchema = object({
		identifier: string().required($t("error.input_required")).trim(),

		password: string()
			.required($t("error.input_required"))
			.min(8, $t("error.min", { values: { field: "Password", value: 8 } }))
	});
	const { form, errors, isSubmitting, handleChange, handleSubmit } = createForm({
		initialValues,
		validationSchema,
		onSubmit: async (values) => {
			const body: LoginBody = {
				...values
			};
			await handleLogin(body);
		}
	});

	let checked: boolean = false;
	let serverError: string = "";

	/**
	 * Handle login
	 * @param body LoginBody
	 */
	const handleLogin = async (body: LoginBody) => {
		// Reset server error
		serverError = "";

		const formData = new FormData();
		formData.append("identifier", body.identifier);
		formData.append("password", body.password);

		try {
			const response = await fetch("?/login", {
				method: "POST",
				body: formData
			});
			const result = deserialize(await response.text());
			const data = (result as any).data as AppServerResponse;

			if (data.code !== "OK") {
				serverError = data.message || "";
				return;
			}

			toastStore.trigger(
				generateToast("success", {
					message: $t("auth.login_success")
				})
			);

			// Redirect to home page
			goto("/admin");
		} catch (error) {
			console.log(error);
		}
	};

	onMount(() => {
		// Check for error query param
		const urlParams = new URLSearchParams($page.url.search);
		const errorParam = urlParams.get("error");
		if (errorParam === "session_expired") {
			toastStore.trigger(
				generateToast("error", {
					message: $t("auth.session_expired")
				})
			);
		}
	});
</script>

<form class="flex w-full flex-col gap-4" on:submit|preventDefault={handleSubmit}>
	<!-- Area: Title -->
	<h1 class="mb-4 text-center text-2xl font-semibold text-slate-700">
		{$t("auth.signin")}
	</h1>

	<!-- Area: Identifier -->
	<InputForm
		id="identifier"
		name="identifier"
		direction="column"
		label="Email/Username"
		type="text"
		placeholder="email@address.com"
		class="[&_.input-form-wrapper]:w-full"
		errorMessage={$errors.identifier}
		showErrorMessage
		bind:value={$form.identifier}
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

	<!-- Area: Remember Me & Forgot Password -->
	<div class="flex items-center justify-between">
		<Checkbox
			placement="end"
			label="form.remember_me"
			class="text-slate-400 dark:text-slate-500"
			bind:checked
		/>

		<a
			href="/auth/forgot-password"
			class="ml-auto text-sm text-primary-500 transition-opacity hover:opacity-80"
		>
			{$t("auth.forgot_password")}
		</a>
	</div>

	<!-- Area: Error Message From Server -->
	{#if serverError}
		<p class="mt-2 text-sm text-red-600">{serverError}</p>
	{/if}

	<!-- Area: Submit Button -->
	<Button type="submit" label={$t("auth.signin")} isLoading={$isSubmitting} class="mt-3" />

	<div class="mx-auto">
		<p class="text-sm text-slate-400">
			{$t("auth.dont_have_account")}
			<a href="/auth/signup" class="text-sm text-primary-500 transition-opacity hover:opacity-80">
				{$t("auth.sign_up_here")}
			</a>
		</p>
	</div>
</form>
