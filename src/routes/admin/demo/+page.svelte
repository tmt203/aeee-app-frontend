<script lang="ts">
	import { ConfirmModal } from "@components/shared/atoms";
	import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";

	const modalStore = getModalStore();

	const handleTriggerDanger = () => {
		// Show modal
		const modal: ModalSettings = {
			type: "component",
			backdropClasses: "!bg-tertiary-800/50",
			component: {
				ref: ConfirmModal,
				props: {
					title: "Delete Confirmation",
					body: "Are you sure you want to delete this item? This action cannot be undone.",
					variant: "danger"
				}
			}
		};

		modalStore.trigger(modal);
	};

	const handleTriggerSuccess = () => {
		// Show modal
		const modal: ModalSettings = {
			type: "component",
			backdropClasses: "!bg-tertiary-800/50",
			component: {
				ref: ConfirmModal,
				props: {
					title: "Success Confirmation",
					body: "Your operation was completed successfully.",
					variant: "success"
				}
			}
		};

		modalStore.trigger(modal);
	};

	const handleTriggerInfo = () => {
		// Show modal
		const modal: ModalSettings = {
			type: "component",
			backdropClasses: "!bg-tertiary-800/50",
			component: {
				ref: ConfirmModal,
				props: {
					title: "Information",
					body: "This is some important information for the user.",
					variant: "info"
				}
			}
		};

		modalStore.trigger(modal);
	};

	const handleTriggerWarning = () => {
		// Show modal
		const modal: ModalSettings = {
			type: "component",
			backdropClasses: "!bg-tertiary-800/50",
			component: {
				ref: ConfirmModal,
				props: {
					title: "Warning",
					body: "Please be cautious while proceeding with this action.",
					variant: "warning"
				}
			}
		};

		modalStore.trigger(modal);
	};
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-4">
	<button class="variant-filled-error btn" on:click={handleTriggerDanger}>Danger</button>
	<button class="variant-filled-success btn" on:click={handleTriggerSuccess}>Success</button>
	<button class="variant-filled-primary btn" on:click={handleTriggerInfo}>Info</button>
	<button class="variant-filled-warning btn" on:click={handleTriggerWarning}>Warning</button>
</div>
