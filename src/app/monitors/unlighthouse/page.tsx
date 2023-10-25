import CommingSoon from '@/components/svg/comming_soon'
import React from 'react'

type Props = {}

export default function page({ }: Props) {
    const zoom = 0.75

    return (
        <div className='w-full h-full'>
            <iframe
                src="https://growitrapid.netlify.app/"
                title="GrowItRapid"
                style={{
                    border: 'none',
                    width: `${10000/(zoom*100)}%`,
                    height: `${10000/(zoom*100)}%`,
                    zoom: zoom,
                    // @ts-ignore
                    msZoom: zoom,
                    MozZoom: zoom,
                    OZoom: zoom,
                    WebkitZoom: zoom,
                    transform: `scale(${zoom})`,
                    OTransform: `scale(${zoom})`,
                    msTransform: `scale(${zoom})`,
                    MozTransform: `scale(${zoom})`,
                    WebkitTransform: `scale(${zoom})`,
                    transformOrigin: '0 0',
                    OTransformOrigin: '0 0',
                    msTransformOrigin: '0 0',
                    MozTransformOrigin: '0 0',
                    WebkitTransformOrigin: '0 0',
                }}
            />
        </div>
    )
}