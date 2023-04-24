import React, { useEffect, useRef, useContext, useState } from 'react';
import { createChart, ColorType, IChartApi, CandlestickData } from 'lightweight-charts';
import { DesktopLayoutLocalStorageContext, DESKTOP_LAYOUT_SETTINGS_KEYS, ChartTradesLocalStorageContext, CHART_TRADES_SETTINGS_KEYS } from '../context/LocalStorageContexts';


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
    data: Array<CandlestickData>,
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
    const [range, setRange] = useState<string>("30m");
    const chartContainerRef = useRef<HTMLDivElement>();

    const { state: desktopLayoutState } = useContext(DesktopLayoutLocalStorageContext);
    const { state: chartTradesState } = useContext(ChartTradesLocalStorageContext);
    const { SHOW_CHART, SHOW_TRADES } = CHART_TRADES_SETTINGS_KEYS;
    const { SIDEBAR_COLLAPSED } = DESKTOP_LAYOUT_SETTINGS_KEYS;

    const btnCss = "p-1/2 rounded-md dark:hover:bg-slate-700 min-w-[2.5rem]";
    const rangeButtons = [
        {
            label: "30m",
            css: btnCss
        },
        {
            label: "1H",
            css: btnCss
        },
        {
            label: "4H",
            css: btnCss
        },
        {
            label: "1D",
            css: btnCss
        }
    ];

    const handleRangeButtonClick = function(buttonIndex: number, buttonLabel: string): void {
        setRange(buttonLabel);
    }


    useEffect(() => {
        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef?.current?.clientWidth, height: chartContainerRef.current?.clientHeight });
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
            chart.applyOptions({ width: chartContainerRef?.current?.clientWidth, height: chartContainerRef.current?.clientHeight });
        }
    }, [desktopLayoutState[SIDEBAR_COLLAPSED], chartTradesState[SHOW_CHART], chartTradesState[SHOW_TRADES]])

    return (
        <div className='flex flex-row flex-wrap w-full h-full'>
            <div className="flex justify-end items-center gap-3 w-full h-1/12 min-h-[4.25rem] border-b dark:border-b-gray-700">
                <div className="flex mr-2 justify-evenly h-4/6 p-1 gap-4 border rounded-md dark:border-gray-600">
                    {
                        rangeButtons.map((button, index) => (
                            <button key={index} className={button.css + " " + (range === button.label ? "dark:bg-slate-400" : "")} onClick={() => handleRangeButtonClick(index, button.label)}>
                                {button.label}
                            </button>
                        ))
                    }
                </div>
            </div>
            <div className="w-full h-11/12" ref={chartContainerRef}></div>

        </div>
    );
}

