
import lightColors from '@primer/primitives/dist/json/colors/light.json';
import darkColors from '@primer/primitives/dist/json/colors/dark.json'

export default function getColors(theme: string): typeof lightColors {
    switch (theme) {
        case "light":

            // Temp override until Primitives are updated
            lightColors.success.emphasis = "#1f883d";
            lightColors.btn.primary.bg = lightColors.success.emphasis;
            lightColors.btn.primary.hoverBg = lightColors.scale.green[5];
            lightColors.fg.default = "#1f2328";
            lightColors.fg.muted = "#656d76";

            return lightColors;

        case "dark":
        default:

            // Temp override until Primitives are updated
            darkColors.fg.default = "#e6edf3";
            darkColors.fg.muted = "#7d8590";
            darkColors.accent.fg = "#2f81f7";
            darkColors.severe.subtle = "rgba(219, 109, 40, 0.1)";
            darkColors.danger.subtle = "rgba(248, 81, 73, 0.1)";
            darkColors.done.subtle = "rgba(163, 113, 247, 0.1)";
            darkColors.sponsors.subtle = "rgba(219, 97, 162, 0.1)";

            return darkColors;
    }
}
