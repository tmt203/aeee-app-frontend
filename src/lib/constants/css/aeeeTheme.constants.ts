import type { CustomThemeConfig } from "@skeletonlabs/tw-plugin";

export const aeeeTheme: CustomThemeConfig = {
	name: "aeee-theme",
	properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `system-ui,'Segoe_UI',Roboto,'Arial',sans-serif`,
		"--theme-font-family-heading": `system-ui,'Segoe_UI',Roboto,'Arial',sans-serif`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "12px",
		"--theme-rounded-container": "24px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "255 255 255",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "255 255 255",
		"--on-success": "255 255 255",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "0 0 0",
		// =~= Theme Colors  =~=
		// primary | #1075BA
		"--color-primary-50": "219 234 245", // #dbeaf5
		"--color-primary-100": "207 227 241", // #cfe3f1
		"--color-primary-200": "195 221 238", // #c3ddee
		"--color-primary-300": "159 200 227", // #9fc8e3
		"--color-primary-400": "88 158 207", // #589ecf
		"--color-primary-500": "16 117 186", // #1075BA
		"--color-primary-600": "14 105 167", // #0e69a7
		"--color-primary-700": "12 88 140", // #0c588c
		"--color-primary-800": "10 70 112", // #0a4670
		"--color-primary-900": "8 57 91", // #08395b
		// secondary | #F0592C
		"--color-secondary-50": "253 230 223", // #fde6df
		"--color-secondary-100": "252 222 213", // #fcded5
		"--color-secondary-200": "251 214 202", // #fbd6ca
		"--color-secondary-300": "249 189 171", // #f9bdab
		"--color-secondary-400": "245 139 107", // #f58b6b
		"--color-secondary-500": "240 89 44", // #F0592C
		"--color-secondary-600": "216 80 40", // #d85028
		"--color-secondary-700": "180 67 33", // #b44321
		"--color-secondary-800": "144 53 26", // #90351a
		"--color-secondary-900": "118 44 22", // #762c16
		// tertiary | #003745
		"--color-tertiary-50": "217 225 227", // #d9e1e3
		"--color-tertiary-100": "204 215 218", // #ccd7da
		"--color-tertiary-200": "191 205 209", // #bfcdd1
		"--color-tertiary-300": "153 175 181", // #99afb5
		"--color-tertiary-400": "77 115 125", // #4d737d
		"--color-tertiary-500": "0 55 69", // #003745
		"--color-tertiary-600": "0 50 62", // #00323e
		"--color-tertiary-700": "0 41 52", // #002934
		"--color-tertiary-800": "0 33 41", // #002129
		"--color-tertiary-900": "0 27 34", // #001b22
		// success | #0BAA60
		"--color-success-50": "218 242 231", // #daf2e7
		"--color-success-100": "206 238 223", // #ceeedf
		"--color-success-200": "194 234 215", // #c2ead7
		"--color-success-300": "157 221 191", // #9dddbf
		"--color-success-400": "84 196 144", // #54c490
		"--color-success-500": "11 170 96", // #0BAA60
		"--color-success-600": "10 153 86", // #0a9956
		"--color-success-700": "8 128 72", // #088048
		"--color-success-800": "7 102 58", // #07663a
		"--color-success-900": "5 83 47", // #05532f
		// warning | #FFCB45
		"--color-warning-50": "255 247 227", // #fff7e3
		"--color-warning-100": "255 245 218", // #fff5da
		"--color-warning-200": "255 242 209", // #fff2d1
		"--color-warning-300": "255 234 181", // #ffeab5
		"--color-warning-400": "255 219 125", // #ffdb7d
		"--color-warning-500": "255 203 69", // #FFCB45
		"--color-warning-600": "230 183 62", // #e6b73e
		"--color-warning-700": "191 152 52", // #bf9834
		"--color-warning-800": "153 122 41", // #997a29
		"--color-warning-900": "125 99 34", // #7d6322
		// error | #CF2A2A
		"--color-error-50": "248 223 223", // #f8dfdf
		"--color-error-100": "245 212 212", // #f5d4d4
		"--color-error-200": "243 202 202", // #f3caca
		"--color-error-300": "236 170 170", // #ecaaaa
		"--color-error-400": "221 106 106", // #dd6a6a
		"--color-error-500": "207 42 42", // #CF2A2A
		"--color-error-600": "186 38 38", // #ba2626
		"--color-error-700": "155 32 32", // #9b2020
		"--color-error-800": "124 25 25", // #7c1919
		"--color-error-900": "101 21 21", // #651515
		// surface | #E2E8F0
		"--color-surface-50": "255 255 255", // #FFFFFF
		"--color-surface-100": "249 250 252", // #f9fafc
		"--color-surface-200": "248 249 251", // #f8f9fb
		"--color-surface-300": "243 246 249", // #f3f6f9
		"--color-surface-400": "235 239 245", // #ebeff5
		"--color-surface-500": "226 232 240", // #E2E8F0
		"--color-surface-600": "203 209 216", // #cbd1d8
		"--color-surface-700": "170 174 180", // #aaaeb4
		"--color-surface-800": "136 139 144", // #888b90
		"--color-surface-900": "50 50 50" // #323232
	}
};
