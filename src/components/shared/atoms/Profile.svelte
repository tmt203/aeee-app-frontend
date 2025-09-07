<script lang="ts">
	import { page } from "$app/stores";
	import { env } from "$env/dynamic/public";
	import { Avatar, ListBox, ListBoxItem, popup, type PopupSettings } from "@skeletonlabs/skeleton";
	import { sidebarExpanded } from "@store/sidebar";
	import clsx from "clsx";
	import { t } from "svelte-i18n";

	export let expanded: boolean;

	const { token, fullname: fullName, level } = $page.data.session;

	const popupProfile: PopupSettings = {
		event: "click",
		target: "popupProfile",
		placement: "bottom-start",
		closeQuery: ".listbox-item"
	};

	let comboboxValue: string = "profile-item";
</script>

<div class="mt-4 flex items-center justify-between">
	<div class="flex cursor-pointer items-center gap-2" use:popup={popupProfile}>
		<div class="rounded-full border border-surface-50">
			<Avatar
				src="/images/avatar.png"
				width={clsx({ "w-8": expanded || $sidebarExpanded, "w-6": !expanded || !$sidebarExpanded })}
			/>
		</div>

		<span class={clsx("text-sm font-medium", { hidden: !expanded && !$sidebarExpanded })}>
			Admin
		</span>
	</div>

	<!-- <div class={clsx("relative mr-3 cursor-pointer", { hidden: !expanded && !$sidebarExpanded })}>
		<Bell color="gray" size={16} />

		<div
			class="absolute -right-[11px] -top-[14px] flex size-4 items-center justify-center rounded-full bg-error-500 p-1 text-sm text-surface-50"
		>
			<span class="text-[10px]">12</span>
		</div>
	</div> -->
</div>

<div
	class="bg-surface-50-900-token z-[999] w-72 rounded-lg p-2 shadow-custom-glass dark:border dark:border-surface-300"
	data-popup="popupProfile"
>
	<ListBox active="bg-primary-500/20">
		<div
			class="flex h-fit cursor-default items-center gap-4 rounded-lg bg-surface-500 px-4 py-2 dark:bg-surface-800"
		>
			<Avatar
				src="/images/avatar.png"
				width="w-10"
				rounded="rounded-full border-neutral-300 border"
			/>
			<div class="flex flex-col">
				Admin
				<span>Admin</span>
			</div>
		</div>
		<ListBoxItem bind:group={comboboxValue} name="profile" value="profile">
			<i class="uil uil-user-exclamation pr-2" />
			{$t("nav_profile.my_profile")}
		</ListBoxItem>
		<ListBoxItem bind:group={comboboxValue} name="profile" value="change_password">
			<i class="uil uil-key-skeleton-alt pr-2" />
			{$t("nav_profile.change_password")}
		</ListBoxItem>

		<!-- Area: Sign out -->
		<button
			class="flex h-10 w-full items-center justify-center gap-2 rounded-b-lg border-t border-t-neutral-200 px-4 transition-colors duration-300 hover:font-semibold hover:text-primary-500"
		>
			<i class="uil uil-sign-out-alt text-xl" />
			{$t("nav_profile.sign_out")}
		</button>
	</ListBox>
</div>
