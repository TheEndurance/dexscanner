import React, { useEffect, useRef, useContext } from 'react';
import { createChart, ColorType, AreaData } from 'lightweight-charts';


interface ChartColors {
    backgroundColor?: string,
    lineColor?: string
    textColor?: string
    areaTopColor?: string
    areaBottomColor?: string
}

interface ChartProps {
    data: Array<AreaData>,
    colors?: ChartColors
}


export default function Chart(props: ChartProps) {
    const {
        data,
        colors: {
            backgroundColor = 'white',
            lineColor = '#2962FF',
            textColor = 'black',
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
        } = {},
    } = props;

    const chartContainerRef = useRef<HTMLDivElement>();
    

    useEffect(() => {
        
        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
        };

        const chart = createChart(chartContainerRef?.current || "", {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef?.current?.clientWidth,
            height: 540,
        });
        chart.timeScale().fitContent();

        const newSeries = chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
        newSeries.setData(data);

        window.addEventListener('resize', handleResize);
        window.addEventListener('transitionend', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('transitionend', handleResize);
            chart.remove();
        };
    },
        [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
    );

    return (
        
            <div className="md:grow md:w-8/12 w-full overflow-hidden" ref={chartContainerRef}/>
        

    );
}

