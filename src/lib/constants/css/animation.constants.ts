export const ANIMATION = {
	skeleton: "reflect 2s ease-out infinite",
	loader: "rotate 1s linear infinite",
	prixClipFix: "prixClipFix 2s linear infinite"
};

export const KEYFRAMES_ANIMATION = {
	reflect: {
		to: { left: "calc(100% + 100px)" }
	},
	rotate: {
		"100%": {
			transform: "rotate(360deg)"
		}
	},
	"active-side-item-animate": {
		"0%": {
			opacity: "0",
			left: "100px"
		},
		"100%": {
			opacity: "1",
			left: "0"
		}
	},
	prixClipFix: {
		"0%": {
			"clip-path": "polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0)"
		},
		"25%": {
			"clip-path": "polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0)"
		},
		"50%": {
			"clip-path": "polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%)"
		},
		"75%": {
			"clip-path": "polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%)"
		},
		"100%": {
			"clip-path": "polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0)"
		}
	}
};
