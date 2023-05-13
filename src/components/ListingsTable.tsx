import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { MessariTablePool } from "./Listings";

import * as dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat';
import d3Format from "../common/d3Format";
import { useNavigate } from "react-router-dom";

dayjs.extend(localizedFormat);

const columnHelper = createColumnHelper<MessariTablePool>()

const columns = [
    columnHelper.accessor(row => row, {
        id: "token",
        header: () => 'Token',
        cell: prop => <>
            <span className="font-bold">{prop.getValue().inputTokens[0].name}</span><span>/{prop.getValue().inputTokens[1].name}</span>
        </>,
    }),
    columnHelper.accessor(row => row.inputTokens[0], {
        id: "price",
        header: () => 'Price',
        cell: prop => <span>${d3Format(".4~s")(parseFloat(prop.getValue().lastPriceUSD))}</span>,
    }),
    columnHelper.accessor(row => row, {
        id: 'dailyVolumeUSD',
        header: "Daily Volume (USD)",
        cell: info => {
            const value = info.getValue();
            const hasDailyVolumeUSD = value && value.dailySnapshots && value.dailySnapshots[0] && value.dailySnapshots[0].dailyVolumeUSD;
            if (hasDailyVolumeUSD) {
                return <i>${d3Format(".4~s")(parseFloat(value.dailySnapshots[0].dailyVolumeUSD)).replace(/G/, "B")}</i>;
            } else {
                return <i>N/A</i>;
            }
        }
    }),
    columnHelper.accessor(row => row, {
        id: 'totalValueLockedUSD',
        header: "TVL (USD)",
        cell: info => {
            const value = info.getValue();
            const hasTotalValueLockedUSD = value && value.dailySnapshots && value.dailySnapshots[0] && value.dailySnapshots[0].totalValueLockedUSD;

            if (hasTotalValueLockedUSD) {
                return <i>${d3Format(".4~s")(parseFloat(info.getValue().dailySnapshots[0].totalValueLockedUSD)).replace(/G/, "B")}</i>;
            } else {
                return <i>N/A</i>;
            }
        }
    }),
    columnHelper.accessor('createdTimestamp', {
        id: 'createdAt',
        header: "Created At",
        cell: info => `${dayjs.unix(parseInt(info.getValue())).format("LLL")}`,
    })
]


function headerClassNameHelper(headerId: string): string {
    if (headerId === "token") {
        return "w-1/3"
    }
    return "";
}

export function ListingsTable({ loading, data }: { loading: boolean, data: Array<MessariTablePool> }) {
    const navigate = useNavigate();
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    function handleRowClick(rowData: MessariTablePool) {
        navigate(`/${rowData.chain}/${rowData.dex}/${rowData.id}`);
    }


    return (

        < table className="flex-auto w-full table-fixed border-separate border-spacing-0" >
            {loading ? <tbody></tbody> : (<>
                <thead className="sticky top-0">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr className="dark:bg-neutral-800" key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th className={"border-r border-b border-t dark:border-neutral-600 p-2" + " " + (headerClassNameHelper(header.getContext().header.id))} key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr className="dark:bg-neutral-950  dark:hover:bg-neutral-900 cursor-pointer" key={row.id} onClick={() => handleRowClick(row.original)}>
                            {row.getVisibleCells().map(cell => (
                                <td className="border-r border-b dark:border-neutral-600 p-2" key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </>)
            }
        </table >
    )
}