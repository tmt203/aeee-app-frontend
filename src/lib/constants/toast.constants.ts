import type { ToastSettings } from "@skeletonlabs/skeleton";

type ToastError = "error" | "success" | "warning" | "info";
interface CustomToast extends Omit<ToastSettings, "background"> {
	icon?: string;
}

export const generateToast = (type: ToastError, toastSettings: CustomToast) => {
	let background = "bg-success-400/95";
	let border = " border-success-600";
	switch (type) {
		case "error":
			background = "bg-error-400/95";
			border = "border-error-600";
			break;
		case "warning":
			background = "bg-warning-400/95";
			border = "border-warning-600";
			break;
		case "info":
			background = "bg-info-300/95";
			border = "border-info-500";
			break;
		default:
			break;
	}
	const message = `<div class='flex justify-center items-center gap-2'>
										<i class='${toastSettings.icon}'></i> 
										${toastSettings.message}
									</div>`;
	const buttonClass =
		"[&_.toast-actions>button]:!bg-white/50 [&_.toast-actions>button]:!text-surface-900 [&_.toast-actions>button:hover]:!bg-white/70 [&_.toast-actions>button:last-child]:!h-6  [&_.toast-actions>button:last-child]:!rounded-lg [&_.toast-actions>button:last-child]:!w-6";
	const classes = `border ${border} !rounded-xl flex-nowrap w-full text-surface-900 font-medium [&>div]:text-center ${buttonClass} ${toastSettings.classes}`;
	const toast: ToastSettings = {
		...toastSettings,
		message: message,
		background: background,
		timeout: toastSettings.timeout || 3000,
		classes
	};
	return toast;
};
