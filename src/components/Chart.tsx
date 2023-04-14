import React, { useEffect, useRef, useContext, useState } from 'react';
import { createChart, ColorType, AreaData, IChartApi } from 'lightweight-charts';
import { AppContext } from '../context/AppContext';


interface ChartColors {
    backgroundColor?: string,
    lineColor?: string
    textColor?: string
    areaTopColor?: string
    areaBottomColor?: string,
    vertLines?: string,
    horzLines?: string
}

interface ChartProps {
    data: Array<AreaData>,
    colors?: ChartColors
}


export default function Chart(props: ChartProps) {
    const {
        data,
        colors: {
            backgroundColor = '#222',
            lineColor = '#2962FF',
            textColor = 'white',
            vertLines = '#444',
            horzLines = '#444'
        } = {},
    } = props;
    const [chart, setChart] = useState<IChartApi | null>();
    const chartContainerRef = useRef<HTMLDivElement>();
    const appState = useContext(AppContext);


    useEffect(() => {
        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
        };

        const chart = createChart(chartContainerRef?.current || "", {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor
            },
            grid: {
                vertLines: { color: vertLines },
                horzLines: { color: horzLines }
            }
        });
        setChart(chart);

        chart.timeScale().fitContent();

        const newSeries = chart.addCandlestickSeries();
        newSeries.setData(data);

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    },
        [data, backgroundColor, lineColor, textColor, vertLines, horzLines]
    );
    useEffect(() => {
        if (chart != null) {
            chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
        }
    }, [appState.isSidebarOpen])

    return (
        <div className='flex flex-row flex-wrap w-full h-full'>
            <div className="w-full h-18/20" ref={chartContainerRef}></div>
            <div className="w-full h-1/20 border-t dark:border-t-gray-700"></div>
        </div>
    );
}

