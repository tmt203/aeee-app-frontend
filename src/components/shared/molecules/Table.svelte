<script lang="ts">
	import { ColumnType, type TableColumn } from "@type/components/table.type";
	import { isCheckboxValueValid } from "@utils/table";
	import { parseToFormat } from "@utils/time";
	import clsx from "clsx";
	import { Menu, SlidersHorizontal } from "lucide-svelte";
	import { onMount, tick } from "svelte";
	import { t } from "svelte-i18n";
	import { ColumnAction, Pagination, RowCount, TableAction } from "../atoms";

	export let tableClass: string = "max-h-[calc(100vh-320px)]";
	export let tableHeaderClass: string = "";
	export let tableFooterClass: string = "";
	export let isLoading: boolean = false;
	export let showFooter: boolean = true;
	export let showHeader: boolean = true;
	export let isRowClick: boolean = false;
	export let rounded: boolean = true;
	export let bordered: boolean = true;
	export let showColumnAction: boolean = true;
	export let resizeColumn: boolean = true;

	// Checkbox
	export let selectedIds: string[] = [];
	export let isCheckbox: boolean = false;

	// Pagination
	export let pageSize: number = 10;
	export let totalItems: number = 0;
	export let currentPage: number = 1;

	// Data
	export let columns: TableColumn[] = [];
	export let data: Record<string, any>[] = [];

	// Function
	export let handlePaging = (page: number) => {
		currentPage = page;
	};
	export let handleRowClick: (row: Record<string, unknown>) => () => void =
		(_row: Record<string, unknown>) => () => {};

	const MIN_COLUMN_WIDTH = 30; // pixels

	let startX: number;
	let startWidth: number;
	let isResizing: boolean = false;
	let orderedColumns: TableColumn[] = [];
	let previousPageSize: number = pageSize;
	let tableElement: HTMLElement | null = null;
	let currentResizer: HTMLElement | null = null;
	let resizingColumnIndex: number | null = null;
	let leftPinnedOffsets: Record<number, number> = {};
	let rightPinnedOffsets: Record<number, number> = {};

	/**
	 * Handle checkbox change
	 * @param event Event
	 */
	const handleCheckboxChange = (event: Event) => {
		const [ok, val, isChecked] = isCheckboxValueValid(event);
		if (!ok) return;
		selectedIds = isChecked ? [...selectedIds, val] : selectedIds.filter((id) => id !== val);
	};

	/**
	 * Handle select all change
	 * @param event Event
	 */
	const handleSelectAllChange = (event: Event) => {
		const [ok, _val, isChecked] = isCheckboxValueValid(event);
		if (!ok) return;
		selectedIds = isChecked ? data.map((item) => item.id) : [];
	};

	/**
	 * On mouse move
	 * @param e MouseEvent
	 */
	const onMouseMove = (e: MouseEvent) => {
		if (!isResizing || resizingColumnIndex === null || !currentResizer) return;

		const diff = e.pageX - startX;
		const newWidth = Math.max(MIN_COLUMN_WIDTH, startWidth + diff);

		// Update only the specific column being resized
		orderedColumns = orderedColumns.map((col, i) => {
			if (i === resizingColumnIndex) {
				return { ...col, width: newWidth };
			}
			return col;
		});
	};

	/**
	 * On mouse up
	 */
	const onMouseUp = () => {
		isResizing = false;
		currentResizer = null;
		resizingColumnIndex = null;

		// Remove event listeners
		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	};

	/**
	 * On mouse down
	 * @param e MouseEvent
	 * @param th HTMLElement | undefined | null
	 * @param index number
	 */
	const onMouseDown = (e: MouseEvent, th: HTMLElement | undefined | null, index: number) => {
		if (!th) return;

		isResizing = true;
		currentResizer = th;
		resizingColumnIndex = index;
		startX = e.pageX;
		startWidth = th.offsetWidth;

		// Add event listeners
		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	};

	/**
	 * Handle resize column
	 * @param e MouseEvent & { currentTarget: EventTarget & HTMLDivElement }
	 */
	const handleResizeColumn =
		(index: number) =>
		(
			e: MouseEvent & {
				currentTarget: EventTarget & HTMLDivElement;
			}
		) => {
			onMouseDown(e, e.currentTarget.parentElement, index);
		};

	/**
	 * Update left position of first column action
	 */
	const updateLeftPositionOfFirstColumnAction = () => {
		// Use setTimeout to ensure the DOM has been updated
		setTimeout(() => {
			const columnActions = document.querySelectorAll(".column-action");
			if (columnActions.length > 0) {
				const firstColumnAction = columnActions[0] as HTMLElement;
				const isPinned = firstColumnAction.classList.contains("is-pinned");
				const currentLeftPosition = firstColumnAction.style.marginLeft;

				if (!isPinned) {
					firstColumnAction.style.marginLeft = `${currentLeftPosition + 176}px`;
				}
			}
		}, 100);
	};

	/**
	 * Run as soon as the component has been mounted to the DOM.
	 */
	onMount(async () => {
		await tick();

		columns = columns.map((col, index) => ({ ...col, index }));
		orderedColumns = [...columns];
		if (!showColumnAction) return;

		updateLeftPositionOfFirstColumnAction();
	});

	// Reactivity to fetch data when page size is changed
	$: if (previousPageSize !== pageSize) {
		handlePaging(currentPage);
		previousPageSize = pageSize;
	}

	$: if (showColumnAction) {
		// Calculate left pinned columns offsets
		leftPinnedOffsets = (() => {
			let offset = 0;
			const offsets: Record<number, number> = {};
			orderedColumns.forEach((col, i) => {
				if (col.pinned === "left") {
					offsets[i] = offset;
					offset += col.width || MIN_COLUMN_WIDTH;
				}
			});
			return offsets;
		})();

		// Calculate right pinned columns offsets
		rightPinnedOffsets = (() => {
			let offset = 0;
			const offsets: Record<number, number> = {};
			// Iterate in reverse order for right pinned columns
			[...orderedColumns].reverse().forEach((col, revIndex) => {
				const i = orderedColumns.length - 1 - revIndex;
				if (col.pinned === "right") {
					offsets[i] = offset;
					offset += col.width || MIN_COLUMN_WIDTH;
				}
			});
			return offsets;
		})();
	}
</script>

<!-- Area: Table Header -->
{#if showHeader}
	<header
		class={clsx(
			"mb-4 flex flex-col items-start justify-between gap-4 text-sm md:flex-row",
			tableHeaderClass
		)}
	>
		<!-- Area: Left header -->
		<div class="table-left-header flex items-center">
			<!-- Area: Input search -->
			<slot name="left-header" />
		</div>

		<!-- Area: Right header -->
		<div class="table-right-header flex items-center gap-4 self-end">
			<slot name="right-header" />
		</div>
	</header>
{/if}

<!-- Area: Table -->
<div
	class={clsx(
		"text-surface-900-50-token table-container bg-primary-100 text-sm scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface-700 dark:!bg-tertiary-500",
		{
			"!rounded-xl": rounded,
			"!rounded-none": !rounded,
			"border-collapse border border-gray-300": bordered
		},
		tableClass
	)}
	bind:this={tableElement}
>
	<table class="h-full w-[calc(100%-2px)]">
		<!-- Area: Table Header -->
		<thead
			class={clsx("sticky top-0 z-40 [&>tr>th]:!text-nowrap", {
				"!rounded-xl": rounded,
				"!rounded-none": !rounded
			})}
		>
			<tr
				class={clsx("[&>th]:h-10", {
					"!rounded-xl [&>th:last-child>div]:!rounded-tr-xl": rounded,
					"!rounded-none": !rounded
				})}
			>
				<!-- Area: Input check box -->
				{#if isCheckbox}
					<th
						class={clsx("relative w-16 bg-surface-500 text-center dark:bg-surface-900", {
							"border border-r-0 border-t-0 border-gray-300 [&:first-child]:border-l-0": bordered
						})}
					>
						<input
							class="checkbox border border-surface-700"
							type="checkbox"
							checked={selectedIds.length === data.length}
							on:change={handleSelectAllChange}
						/>
					</th>
				{/if}

				<!-- Area: Header -->
				{#each orderedColumns as column, index}
					{#if !column.isHidden}
						<th
							class={clsx("bg-surface-500 dark:bg-surface-900 [&:first-child]:border-l-0", {
								"border border-t-0 border-gray-300": bordered,
								"w-16": index === columns.length - 1,
								"is-pinned !border-x-0 !bg-primary-100 dark:!bg-tertiary-500": column.pinned
							})}
							style="
							min-width: {column.width ? column.width + 'px' : 'auto'};
							{column.pinned === 'left'
								? `position: sticky; left: ${leftPinnedOffsets[index]}px; z-index: 10;`
								: ''}
							{column.pinned === 'right'
								? `position: sticky; right: ${rightPinnedOffsets[index]}px; z-index: 10;`
								: ''}
						"
						>
							<div
								class={clsx(
									"relative flex h-full w-full items-center gap-1 px-3",
									{
										"text-start": !column.placement || column.placement === "left",
										"text-center": column.placement === "center",
										"text-end": column.placement === "right"
									},
									column.cellClass
								)}
							>
								{#if column.label !== "action"}
									<span class="w-full truncate">
										{column.label !== "action" ? $t(column.label) : ""}
									</span>
								{/if}
								{#if column.label === "action"}
									<div class="mx-auto">
										<TableAction
											{columns}
											columnId="action"
											icon={SlidersHorizontal}
											bind:orderedColumns
											onAfterClick={updateLeftPositionOfFirstColumnAction}
										/>
									</div>
								{:else if showColumnAction}
									<ColumnAction
										icon={Menu}
										columnId={column.label}
										bind:orderedColumns
										bind:isPinned={column.pinned}
										onAfterClick={updateLeftPositionOfFirstColumnAction}
									/>
								{/if}

								<!-- Area: Resize Handle -->
								{#if resizeColumn}
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<div
										class="absolute -right-[2px] top-0 z-[9] h-full w-1 cursor-col-resize bg-gray-300 opacity-0 hover:opacity-100"
										on:mousedown={handleResizeColumn(index)}
									/>
								{/if}
							</div>
						</th>
					{/if}
				{/each}
			</tr>
		</thead>

		<!-- Area: Table body -->
		<tbody
			class="[&>tr:last-child>td]:border-b-0 [&>tr>td]:!text-nowrap [&>tr>td]:!py-1 [&>tr>td]:!align-middle [&>tr]:!h-9"
		>
			{#if data.length > 0}
				{#each data as row}
					<tr
						on:click={handleRowClick(row)}
						class={clsx(
							"odd:bg-gray-100 even:bg-gray-50 dark:odd:bg-surface-900 dark:even:bg-[rgb(70,70,75)]",
							{
								"cursor-pointer": isRowClick
							}
						)}
					>
						<!-- Area: Input check box -->
						{#if isCheckbox}
							<td
								class={clsx(
									"w-fit px-3 text-center [&:first-child]:border-l-0 [&:nth-child(even)]:bg-gray-50 dark:[&:nth-child(even)]:bg-surface-800/20",
									{
										"border border-r-0 border-t-0 border-gray-300": bordered
									}
								)}
							>
								{#if isLoading}
									<div class="placeholder animate-pulse !bg-surface-600" />
								{:else}
									<input
										class="checkbox border border-surface-700"
										type="checkbox"
										checked={selectedIds.includes(row.id)}
										id={row.id}
										value={row.id}
										on:change={handleCheckboxChange}
									/>
								{/if}
							</td>
						{/if}

						<!-- Area: Cell data table -->
						{#each orderedColumns as column, index}
							{#if !column.isHidden}
								<td
									align={column.placement}
									class={clsx(
										"!px-3",
										{
											"border border-t-0 border-gray-300 [&:first-child]:border-l-0": bordered,
											"!border-x-0 !bg-primary-100 dark:!bg-tertiary-500": column.pinned,
											"overflow-hidden": column.label !== "action",
											"action-cell": column.label === "action"
										},
										column.cellClass
									)}
									style="
									max-width: {column.width ? column.width + 'px' : 'auto'};
									{column.pinned === 'left'
										? `position: sticky; left: ${leftPinnedOffsets[index]}px; background: inherit; z-index: 10;`
										: ''}
									{column.pinned === 'right'
										? `position: sticky; right: ${rightPinnedOffsets[index]}px; background: inherit; z-index: 10;`
										: ''}
								"
								>
									{#if isLoading}
										<div class="placeholder animate-pulse !bg-surface-600" />
									{:else if column.key}
										{#if column.render}
											<div class="truncate">
												{@html column.render(row)}
											</div>
										{:else if column.action}
											<a
												href={column.action.link ?? "#"}
												class="block truncate text-inherit no-underline"
												on:click={() =>
													column.action?.function ? column.action.function(row) : {}}
											>
												{#if column.action.icon}
													<i class={column.action.icon}></i>
												{/if}
												{#if column.action.title}
													<span class="truncate">
														{column.action.title}
													</span>
												{/if}
											</a>
										{:else if column.dataType === ColumnType.DateTime}
											<div class="truncate">
												{row[column.key]
													? parseToFormat(row[column.key], "dd/MM/yyy HH:mm:ss")
													: ""}
											</div>
										{:else if column.dataType == ColumnType.Number}
											<div class="truncate">
												{row[column.key] ? row[column.key] : 0}
											</div>
										{:else}
											<div class="truncate">
												{row[column.key] ? row[column.key] : ""}
											</div>
										{/if}
									{:else if column.dataType === ColumnType.Action}
										{#if column.data}
											{#each column.data as item}
												{#if item?.component && item?.props}
													<svelte:component this={item.component(row)} {...item.props(row)} />
												{/if}
											{/each}
										{:else}
											Invalid
										{/if}
									{:else}
										<div class="truncate">Missing key</div>
									{/if}
								</td>
							{/if}
						{/each}
					</tr>
				{/each}
			{:else}
				<!-- Area: Case data empty -->
				<tr>
					{#if isLoading}
						{#each columns as _}
							<td class="border border-gray-300">
								<div class="placeholder animate-pulse !bg-surface-600" />
							</td>
						{/each}
					{:else}
						<td
							colspan={columns ? columns?.filter((col) => !col.isHidden).length + 1 : 0}
							class="border border-l-0 border-gray-300 text-center"
						>
							{$t("no_data")}
						</td>
					{/if}
				</tr>
			{/if}
		</tbody>
	</table>
</div>

<!-- Area: Table Footer -->
{#if !isLoading && showFooter}
	<footer
		class={clsx(
			"mt-4 flex flex-wrap items-start justify-between gap-4 !bg-transparent",
			tableFooterClass
		)}
	>
		<!-- Area: Row count -->
		<div class="flex items-center gap-4">
			<RowCount {currentPage} {pageSize} {totalItems} />
		</div>

		<!-- Area: Pagination -->
		<Pagination bind:currentPage bind:pageSize {totalItems} onSetPaging={handlePaging} />
	</footer>
{/if}
