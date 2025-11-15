<script lang="ts">
	import { Button, InputForm } from "@components/shared/molecules";
	import { getToastStore } from "@skeletonlabs/skeleton";
	import { Info } from "lucide-svelte";
	import { createForm } from "svelte-forms-lib";
	import { t } from "svelte-i18n";
	import { object, string } from "yup";

	const toastStore = getToastStore();

	const initialValues = {
		email: ""
	};
	const validationSchema = object({
		email: string().required($t("error.input_required")).trim().email($t("error.email_invalid"))
	});
	const { form, errors, isSubmitting, handleChange, handleSubmit } = createForm({
		initialValues,
		validationSchema,
		onSubmit: async (values) => {
			console.log(values);
		}
	});

	let serverError: string = "";
</script>

<form class="flex w-full flex-col gap-4" on:submit|preventDefault={() => {}}>
	<!-- Area: Title -->
	<h1 class="text-center text-2xl font-semibold text-slate-700">
		{$t("auth.forgot_password_page.header")}
	</h1>

	<!-- Area: Subtitle -->
	<p class="variant-soft-primary flex items-center gap-2 rounded-lg p-2 text-left text-sm">
		<Info size={32} />
		{$t("auth.forgot_password_page.subheader")}
	</p>

	<!-- Area: Email -->
	<InputForm
		id="email"
		name="email"
		direction="column"
		type="text"
		placeholder="email@address.com"
		class="[&_.input-form-wrapper]:w-full"
		errorMessage={$errors.email}
		showErrorMessage
		bind:value={$form.email}
	/>

	<!-- Area: Error Message From Server -->
	{#if serverError}
		<p class="text-sm text-red-600">{serverError}</p>
	{/if}

	<!-- Area: Submit Button -->
	<Button type="submit" label={$t("form.send")} isLoading={$isSubmitting} />

	<div class="mx-auto">
		<a href="/auth/signin" class="text-sm text-primary-500 transition-opacity hover:opacity-80">
			{$t("auth.forgot_password_page.back_to_signin")}
		</a>
	</div>
</form>
