<script lang="ts">
	import * as pkg from "@easepick/bundle";
	import * as easepick from "@easepick/core";
	import type { PopupSettings } from "@skeletonlabs/skeleton";
	import { modeCurrent, popup } from "@skeletonlabs/skeleton";
	import type { Size } from "@type/common.type";
	import clsx from "clsx";
	import { format, formatISO } from "date-fns";
	import { onDestroy, onMount } from "svelte";
	import { locale, t } from "svelte-i18n";
	import { Icon } from "../atoms";

	export let size: Size = "md";
	export let label: string = "table.time";
	export let value: string = "";
	export let id: string = "";
	export let startTime: string = "";
	export let endTime: string = "";
	export let icon: string = "uil uil-clock";
	export let iconSize: Size = "lg";
	export let disabled: boolean = false;
	export let showRange: boolean = false;
	export let showPreset: boolean = false;
	export let minYear: number = 1950;
	export let maxYear: number = new Date().getFullYear();
	export let errorMessage: string = "";
	export let showErrorMessage: boolean = false;
	export let onChange: () => void = () => {};
	export let onAfterRemove: () => void = () => {};

	const { AmpPlugin, PresetPlugin, RangePlugin } = pkg;
	const datePicker: PopupSettings = {
		event: "click",
		target: `datePicker-${id}`,
		placement: "bottom-start",
		closeQuery: "#close-input-time"
	};

	let isMounted: boolean = false;
	let datepicker: easepick.Core | null;

	/**
	 * Initialize date picker
	 */
	const initializeDatepicker = () => {
		// Destroy the existing instance if it exists
		if (datepicker) {
			datepicker.destroy();
			datepicker = null;
		}

		if (disabled) return;

		if (startTime && endTime) {
			value = `${format(new Date(startTime), "dd/MM/yyyy")} - ${format(new Date(endTime), "dd/MM/yyyy")}`;
		}

		datepicker = new easepick.create({
			element: `#${id}`,
			lang: $locale || "en-US",
			css: ["/css/easepick.css", "/css/date_picker.css"],
			zIndex: 10,
			grid: showRange ? 2 : 1,
			calendars: showRange ? 2 : 1,
			autoApply: true,
			format: "DD/MM/YYYY",
			inline: true,
			AmpPlugin: {
				dropdown: {
					months: true,
					years: true,
					minYear,
					maxYear
				},
				darkMode: !$modeCurrent
			},
			plugins: [
				AmpPlugin,
				...(showRange ? [RangePlugin] : []),
				...(showPreset ? [PresetPlugin] : [])
			],
			locale: {
				apply: $t("ease_pick.apply"),
				cancel: $t("ease_pick.cancel")
			},
			PresetPlugin: {
				customLabels: [
					$t("time.today"),
					$t("time.yesterday"),
					$t("time.last_7_days"),
					$t("time.last_30_days"),
					$t("time.this_month"),
					$t("time.last_month")
				]
			},
			setup(picker) {
				picker.on("select", (e) => {
					if (!showRange) {
						const selectedDate = e.detail.date;
						value = format(selectedDate, "dd/MM/yyyy");
						startTime = formatISO(selectedDate);
						endTime = formatISO(selectedDate);
						onChange && onChange();
						e.stopPropagation();
						return;
					}

					const { start, end } = e.detail;
					value = `${format(start, "dd/MM/yyyy")} - ${format(end, "dd/MM/yyyy")}`;
					startTime = formatISO(start);
					endTime = formatISO(end);
					onChange && onChange();
					e.stopPropagation();
				});

				picker.on("click", (e) => {
					const target = e.target as HTMLElement;
					if (target) {
						if (target.hasAttribute("date-start") && target.hasAttribute("date-end")) {
							const presetStartValue = target.getAttribute("data-start");
							datepicker!.gotoDate(new Date(Number(presetStartValue)));
						}
					}
				});
			}
		});
	};

	/**
	 * Handle remove value
	 */
	const handleRemoveValue = () => {
		if (disabled) return;

		value = "";
		startTime = "";
		endTime = "";

		if (datepicker) {
			datepicker.clear();
			datepicker.hide();
		}

		onAfterRemove && onAfterRemove();
	};

	// Reactive block to reinitialize date picker when locale changes
	$: if (isMounted && ($locale || $modeCurrent)) {
		initializeDatepicker();
	}

	$: if (isMounted) {
		if (disabled && datepicker) {
			if (datepicker) {
				datepicker.destroy();
				datepicker = null;
			}
		} else {
			if (!datepicker) {
				initializeDatepicker();
			}
		}
	}

	/**
	 * Run as soon as the component has been mounted to the DOM.
	 */
	onMount(() => {
		isMounted = true;
	});

	/**
	 * Clean up when the component is destroyed
	 */
	onDestroy(() => {
		if (datepicker) {
			datepicker.destroy();
			datepicker = null;
		}
	});
</script>

<div class="flex w-full min-w-fit flex-col gap-2">
	<div
		class={clsx(
			"flex min-w-fit cursor-pointer items-center gap-1 rounded-xl border bg-surface-200 px-2 dark:bg-gray-700",
			{ "cursor-not-allowed opacity-50": disabled },
			{
				"!border-slate-300 focus:!border-primary-500 focus:shadow-md": !errorMessage?.length,
				"!border-error-500": errorMessage?.length
			},
			{
				// Size
				"h-7": size === "sm",
				"h-9": size === "md",
				"h-10": size === "lg",
				"h-12": size === "xl",
				"h-14": size === "2xl"
			},
			$$props.class
		)}
		use:popup={datePicker}
	>
		<div class="flex items-center gap-1">
			<!-- Area: Icon -->
			<Icon {icon} size={iconSize} />

			<!-- Area: Date Time -->
			<span class="min-w-fit text-sm">{`${$t(label)}${value.length ? ": " : ""}`}{value}</span>
		</div>

		{#if value.length}
			<Icon
				icon="uil uil-times-circle"
				onClick={handleRemoveValue}
				class="ml-auto p-[0.5px] pl-2"
			/>
		{/if}
	</div>

	{#if showErrorMessage && errorMessage?.length}
		<span class="text-xs text-error-500">
			{$t(errorMessage)}
		</span>
	{/if}
</div>

<!-- Area: Date Picker Popup -->
<div class="z-[999]" data-popup="datePicker-{id}">
	<input type="hidden" {id} />
</div>
