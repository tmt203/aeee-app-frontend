<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { Avatar, ListBox, ListBoxItem, popup, type PopupSettings } from "@skeletonlabs/skeleton";
	import { sidebarExpanded } from "@store/sidebar";
	import clsx from "clsx";
	import { KeyRound, LogOut, UserRoundCog } from "lucide-svelte";
	import { t } from "svelte-i18n";

	export let expanded: boolean;

	const popupProfile: PopupSettings = {
		event: "click",
		target: "popupProfile",
		placement: "bottom-start",
		closeQuery: ".listbox-item"
	};

	let comboboxValue: string = "profile-item";

	/**
	 * Handle logout
	 */
	const handleLogout = () => {
		goto("/auth/logout");
	};
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
	class="z-[999] w-56 rounded-lg bg-white p-2 shadow-custom-glass dark:border dark:border-tertiary-800 dark:bg-gray-800"
	data-popup="popupProfile"
>
	<ListBox
		active="bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-primary-500/[0.12] to-primary-500/[0.04] dark:from-primary-500/[0.24] [&_.listbox-label-content>div>svg]:stroke-primary-500"
		hover="hover:bg-primary-500/10"
		padding="p-2"
		rounded="rounded-lg"
	>
		<!-- Area: Account Info -->
		<ListBoxItem bind:group={comboboxValue} name="profile" value="profile">
			<div class="flex items-center gap-2 text-sm font-semibold">
				<UserRoundCog class="stroke-secondary-text-color" size={16} strokeWidth={2.5} />
				{$t("nav_profile.my_profile")}
			</div>
		</ListBoxItem>

		<!-- Area: Change Password -->
		<ListBoxItem bind:group={comboboxValue} name="profile" value="change_password">
			<div class="flex items-center gap-2 text-sm font-semibold">
				<KeyRound class="stroke-secondary-text-color" size={16} strokeWidth={2.5} />
				{$t("nav_profile.change_password")}
			</div>
		</ListBoxItem>

		<!-- Area: Sign out -->
		<ListBoxItem bind:group={comboboxValue} name="profile" value="sign_out" on:click={handleLogout}>
			<div class="flex items-center gap-2 text-sm font-semibold">
				<LogOut class="stroke-secondary-text-color" size={16} strokeWidth={2.5} />
				{$t("nav_profile.sign_out")}
			</div>
		</ListBoxItem>
	</ListBox>
</div>
