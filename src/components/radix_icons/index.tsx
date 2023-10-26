import * as RadixIcons from '@radix-ui/react-icons';
import { IconProps } from '@radix-ui/react-icons/dist/types';

export type Icon = {
    id: string,
    name: string,
    component: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>,
};

export default function radix_icons(): Icon[] {
    const icons: Icon[] = [];

    for (const icon in RadixIcons) {
        icons.push({
            id: icon,
            name: icon.replace(/([A-Z])/g, ' $1').trim(),
            // @ts-ignore
            component: RadixIcons[icon] as any,
        });
    }

    return icons;
}

