// simple wrapper around the Express backend residing under /api
// all helpers translate the MongoDB response shape into the frontend-friendly
// format that the React components expect (mimicking the previous Supabase
// types).  By doing the mapping here we can keep the component logic mostly
// unchanged.

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// a generic record returned by the backend; properties are dynamic so we
// treat everything as unknown and cast later
interface RawDBObject {
    _id: string;
    [k: string]: unknown;
}

function mapId<T extends RawDBObject>(obj: T): T & { id: string } {
    const { _id, ...rest } = obj;
    return { ...(rest as unknown as T), id: _id } as T & { id: string };
}

export interface Categoria {
    id: string;
    nombre: string;
    descripcion?: string;
    codigo?: string;
    activo?: boolean;
}

export interface Proveedor {
    id: string;
    empresa: string;
    contacto: string;
    pais: string;
    categoria_suministro: string;
}

export interface Cliente {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    ciudad?: string;
    // stats added when sales are recorded
    compras?: number;
    totalGastado?: number;
}

export interface Venta {
    id: string;
    cantidad: number;
    total: number;
    fecha?: string;
    productos?: Producto;
    clientes?: Cliente;
}

export interface Producto {
    descripcion: string;
    id: string;
    nombre: string;
    precio: number;
    stock: number;
    categoria_id?: string;
    // supabase shape, kept for compatibility
    categorias?: Categoria;
    // raw backend populate (after populate call this is object, but we also accept
    // string when sending update payload)
    categoria?: Categoria | string;
    proveedor?: Proveedor;
}

// payload expected by the server when creating/updating a producto
export type ProductoRequest = {
    nombre: string;
    precio: number;
    stock: number;
    categoria?: string;
    proveedor?: string;
};

// generic fetch helper
async function call<T>(path: string, options?: RequestInit): Promise<T> {
    const resp = await fetch(`${API_BASE}${path}`, options);
    if (!resp.ok) {
        const err = await resp.text();
        throw new Error(`API request failed (${resp.status}): ${err}`);
    }
    return resp.json();
}

/* ----- categorias ----- */
export async function getCategorias(): Promise<Categoria[]> {
    const raw = await call<RawDBObject[]>("/categorias");
    return raw.map((c) => {
        const mapped = mapId(c) as unknown as Categoria;
        return mapped;
    });
}

export async function createCategoria(data: Partial<Categoria>) {
    return call("/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

/* ----- proveedores ----- */
export async function getProveedores(): Promise<Proveedor[]> {
    const raw = await call<RawDBObject[]>("/proveedores");
    return raw.map((p) => mapId(p) as unknown as Proveedor);
}

export async function createProveedor(data: Partial<Proveedor>) {
    return call("/proveedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

/* ----- productos ----- */
export async function getProductos(): Promise<Producto[]> {
    const raw = await call<RawDBObject[]>("/productos");
    return raw.map((p) => {
        const prod = mapId(p) as unknown as Producto;
        // keep supabase-compatible field names so components don't need updates
        if (prod.categoria && typeof prod.categoria !== "string") {
            const rawCat = prod.categoria as unknown as RawDBObject;
            const cat = rawCat as unknown as Categoria;
            prod.categorias = { ...cat, id: rawCat._id };
            prod.categoria_id = rawCat._id;
        }
        return prod;
    });
}

export async function createProducto(data: ProductoRequest) {
    return call("/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function updateProducto(id: string, data: ProductoRequest) {
    return call(`/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export async function deleteProducto(id: string) {
    return call(`/productos/${id}`, { method: "DELETE" });
}

/* ----- clientes ----- */
export async function getClientes(): Promise<Cliente[]> {
    const raw = await call<RawDBObject[]>("/clientes");
    return raw.map((c) => mapId(c) as unknown as Cliente);
}

export async function createCliente(data: Partial<Cliente>) {
    return call("/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

/* ----- ventas ----- */
export async function getVentas(): Promise<Venta[]> {
    const raw = await call<RawDBObject[]>("/ventas");
    return raw.map((v) => {
        const venta = mapId(v) as unknown as Venta;
        // translate populate names to supabase shape
        if ((v as unknown as RawDBObject).producto) {
            venta.productos = mapId(
                (v as unknown as RawDBObject).producto as RawDBObject,
            ) as unknown as Producto;
        }
        if ((v as unknown as RawDBObject).cliente) {
            venta.clientes = mapId(
                (v as unknown as RawDBObject).cliente as RawDBObject,
            ) as unknown as Cliente;
        }
        venta.fecha = ((v as unknown as RawDBObject).fechaVenta ||
            (v as unknown as RawDBObject).fecha) as string;
        return venta;
    });
}

export async function createVenta(data: Partial<Venta>) {
    return call("/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}
