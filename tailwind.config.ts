import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // Medical Blue Color Scheme
        "medical-blue": {
          DEFAULT: "#0066CC",
          50: "#E6F1FF",
          100: "#CCE4FF",
          200: "#99C9FF",
          300: "#66ADFF",
          400: "#3392FF",
          500: "#0066CC",
          600: "#0052A3",
          700: "#003D7A",
          800: "#002952",
          900: "#001429",
        },
        "clinical-grey": {
          DEFAULT: "#F8F9FA",
          50: "#FFFFFF",
          100: "#F8F9FA",
          200: "#E9ECEF",
          300: "#DEE2E6",
          400: "#CED4DA",
          500: "#ADB5BD",
          600: "#6C757D",
          700: "#495057",
          800: "#343A40",
          900: "#212529",
        },
        success: {
          DEFAULT: "#10B981",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        warning: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        error: {
          DEFAULT: "#EF4444",
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-in": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        "pulse-medical": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.7",
          },
        },
        "shimmer": {
          "0%": {
            backgroundPosition: "-468px 0",
          },
          "100%": {
            backgroundPosition: "468px 0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-in-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-medical": "pulse-medical 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "medical": "0 4px 6px -1px rgba(0, 102, 204, 0.1), 0 2px 4px -1px rgba(0, 102, 204, 0.06)",
        "medical-lg": "0 10px 15px -3px rgba(0, 102, 204, 0.1), 0 4px 6px -2px rgba(0, 102, 204, 0.05)",
        "medical-xl": "0 20px 25px -5px rgba(0, 102, 204, 0.1), 0 10px 10px -5px rgba(0, 102, 204, 0.04)",
        "clinical": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "clinical-md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "clinical-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      screens: {
        "xs": "475px",
        "3xl": "1680px",
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2",
        "2/3": "2 / 3",
        "9/16": "9 / 16",
      },
      lineHeight: {
        "11": "2.75rem",
        "12": "3rem",
        "13": "3.25rem",
        "14": "3.5rem",
      },
      letterSpacing: {
        "widest": "0.1em",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "bounce-out": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "medical-gradient": "linear-gradient(135deg, #0066CC 0%, #0052A3 100%)",
        "clinical-gradient": "linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)",
        "shimmer": "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
      },
      blur: {
        xs: "2px",
      },
      brightness: {
        25: ".25",
        175: "1.75",
      },
      contrast: {
        25: ".25",
        175: "1.75",
      },
      saturate: {
        25: ".25",
        175: "1.75",
      },
      sepia: {
        25: ".25",
        75: ".75",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    // Custom plugin for medical utilities
    function({ addUtilities, theme }: { addUtilities: any, theme: any }) {
      const newUtilities = {
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.container-medical': {
          'max-width': theme('maxWidth.7xl'),
          'margin-left': 'auto',
          'margin-right': 'auto',
          'padding-left': theme('spacing.4'),
          'padding-right': theme('spacing.4'),
          '@screen sm': {
            'padding-left': theme('spacing.6'),
            'padding-right': theme('spacing.6'),
          },
          '@screen lg': {
            'padding-left': theme('spacing.8'),
            'padding-right': theme('spacing.8'),
          },
        },
        '.space-medical': {
          '& > * + *': {
            'margin-top': theme('spacing.6'),
          },
        },
        '.glass-medical': {
          'background': 'rgba(255, 255, 255, 0.8)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.scrollbar-medical': {
          'scrollbar-width': 'thin',
          'scrollbar-color': `${theme('colors.medical-blue.DEFAULT')} ${theme('colors.clinical-grey.200')}`,
          '&::-webkit-scrollbar': {
            'width': '6px',
          },
          '&::-webkit-scrollbar-track': {
            'background': theme('colors.clinical-grey.100'),
          },
          '&::-webkit-scrollbar-thumb': {
            'background': theme('colors.medical-blue.DEFAULT'),
            'border-radius': '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background': theme('colors.medical-blue.600'),
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
