import React from "react";
import { Column, useTable } from "react-table";

interface PropertyData {
  classification: number;
  address: string;
  destiny: string;
  detailsMaintenance: string;
  file: string;
  goodUseCode: number;
  description: string;
  province: string;
  locality: string;
  betweenStreets: string;
  postalCode: number;
  district: string;
  destinyUse: string;
}

interface TableProps {
  properties: PropertyData[];
}

const PropertiesTable: React.FC<TableProps> = ({ properties }) => {
  // Define las columnas de la tabla
  const columns = React.useMemo(
    (): Column<PropertyData>[] => [
      {
        Header: "Código Bien de Uso",
        accessor: "goodUseCode",
      },
      {
        Header: "Clasificación",
        accessor: "classification",
      },
      {
        Header: "Dirección",
        accessor: "address",
      },
      {
        Header: "Destino",
        accessor: "destiny",
      },
      {
        Header: "Detalles de Mantenimiento",
        accessor: "detailsMaintenance",
      },
      {
        Header: "Archivo",
        accessor: "file",
      },
      {
        Header: "Descripción",
        accessor: "description",
      },
      {
        Header: "Provincia",
        accessor: "province",
      },
      {
        Header: "Localidad",
        accessor: "locality",
      },
      {
        Header: "Entre Calles",
        accessor: "betweenStreets",
      },
      {
        Header: "Código Postal",
        accessor: "postalCode",
      },
      {
        Header: "Distrito",
        accessor: "district",
      },
      {
        Header: "Uso de Destino",
        accessor: "destinyUse",
      },
    ],
    []
  );

  // Usar la función useTable para obtener las propiedades de la tabla
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: properties });

  return (
    <div className="overflow-x-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-orange-500 mb-4">Propiedades</h2>
      <table
        {...getTableProps()}
        className="min-w-full table-auto text-white"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-700">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="px-4 py-2 text-left"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="bg-gray-800 border-b border-gray-600">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="px-4 py-2">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PropertiesTable;
