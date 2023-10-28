import * as RadixIcons from '@radix-ui/react-icons';
import { IconProps } from '@radix-ui/react-icons/dist/types';

export type Icon = {
    id: string,
    name: string,
    component: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>,
};

const radix_icons: Icon[] = [];

for (const icon in RadixIcons) {
    radix_icons.push({
        id: icon,
        name: icon.replace(/([A-Z])/g, ' $1').trim(),
        // @ts-ignore
        component: (RadixIcons[icon] as any) || RadixIcons.FrameIcon,
    });
}

export default radix_icons;

export function get_radix_icon(id: string): Icon {
    const icon = radix_icons.find(icon => icon.id === id);
    if (!icon) {
        return {
            id: 'FrameIcon',
            name: 'Frame Icon',
            component: RadixIcons.FrameIcon,
        }
    }
    return icon;
}
