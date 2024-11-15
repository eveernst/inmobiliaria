import { useForm } from "react-hook-form";

const InmuebleAlquilado = () => {
  const { register } = useForm();

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="ownerDetails">Datos del propietario</label>
          <input
            id="ownerDetails"
            className="bg-gray-700 p-2 rounded w-full"
            {...register("ownerDetails")}
          />
        </div>
        <div>
            <label htmlFor="affectation">Afectacion</label>
            <select
              id="affectation"
              className="bg-gray-700 p-2 rounded w-full"
              {...register("affectation", { required: "Este campo es obligatorio" })}
            >
              <option value="">Seleccionar</option>
              <option value="option1">Opción 1</option>
              <option value="option2">Opción 2</option>
            </select>
          </div>
        <div>
          <label htmlFor="contacto-propietario">Contacto</label>
          <input
            id="contacto-propietario"
            className="bg-gray-700 p-2 rounded w-full"
            {...register("contactoPropietario")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="datos-inquilino">Datos del inquilino</label>
          <input
            id="datos-inquilino"
            className="bg-gray-700 p-2 rounded w-full"
            {...register("datosInquilino")}
          />
        </div>
        <div>
          <label htmlFor="contacto-inquilino">Contacto</label>
          <input
            id="contacto-inquilino"
            className="bg-gray-700 p-2 rounded w-full"
            {...register("contactoInquilino")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="fecha-comienzo">Fecha de comienzo del contrato</label>
          <input
            id="fecha-comienzo"
            type="date"
            className="bg-gray-700 p-2 rounded w-full"
            {...register("fechaComienzo")}
          />
        </div>
        <div>
          <label htmlFor="fecha-finalizacion">Fecha de finalización del contrato</label>
          <input
            id="fecha-finalizacion"
            type="date"
            className="bg-gray-700 p-2 rounded w-full"
            {...register("fechaFinalizacion")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="monto">Monto $</label>
          <input
            id="monto"
            type="number"
            className="bg-gray-700 p-2 rounded w-full"
            {...register("monto")}
          />
        </div>
        <div>
          <label htmlFor="tipo-ajuste">Tipo de ajuste</label>
          <input
            id="tipo-ajuste"
            className="bg-gray-700 p-2 rounded w-full"
            {...register("tipoAjuste")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contrato">Contrato</label>
        <input
          id="contrato"
          type="file"
          className="bg-gray-700 p-2 rounded w-full"
          {...register("contrato")}
        />
      </div>
    </>
  );
};

export default InmuebleAlquilado;
