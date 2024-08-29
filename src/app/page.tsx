import Image from "next/image";
import Header from "../components/header.jsx"
export default function Home() {
  return (
    <div>
      <Header />
      <main className="content">
          <div className="actions">
              <button className="new-property">nueva propiedad</button>
          </div>
          <div className="table-container">
              <table className="property-table">
                  <thead>
                      <tr>
                          <th>Propiedades</th>
                          <th>Clasificación</th>
                          <th>ID</th>
                          <th>Acciones</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>
                              <div className="property">
                                  {/* 2<Image src="image-placeholder.png" alt="Property" width={10} height={10}/> */}
                                  <div>
                                      <div>Propiedad 1</div>
                                      <div className="destination">destino</div>
                                  </div>
                              </div>
                          </td>
                          <td>Clasificación</td>
                          <td>1</td>
                          <td>
                              <button className="modify-btn">Modificar</button>
                              <button className="delete-btn">Eliminar</button>
                          </td>
                      </tr>
                      {/* Añadir más filas de propiedades según sea necesario */}
                  </tbody>
              </table>
          </div>
          <div className="pagination">
              <button>&lt;</button> {/*  */}
              <button>1</button>
              <button>2</button>
              <button>3</button>
              <button>4</button>
              <button>5</button>
              <button>&gt;</button>
          </div>
      </main>
    </div>
  );
}