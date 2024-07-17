import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


/**
 * El schema del producto debe contener:
 * - nombre: nombre del producto es requerido y debe ser un texto
 * - descripcion: descripcion del producto es requerida y debe ser un texto
 * - id_categoria: categoria del producto es requerida y debe ser un número entero positivo
 * - precio: precio del producto es requerido y debe ser un número positivo
 * - imagen_default: imagen del producto es opcional y debe ser un archivo de imagen
 * - status: estado del producto es opcional y debe ser un booleano
 */

export const productosSchema = z.object({
    nombre: z
        .string({
            invalid_type_error: "Nombre del producto debe ser un texto",
            required_error: "Nombre del producto es requerido",
        }),
    descripcion: z
        .string({
            invalid_type_error: "Descripcion del producto debe ser un texto",
            required_error: "Descripción del producto es requerida",
        }).max(255,{
            message: "La descripción del producto no puede tener más de 255 caracteres"
        }),
    id_categoria: z
        .union([
            z.string({
                required_error: "Categoria del producto es requerida",
            }).regex(/^\d+$/, {
                message: "La categoria del producto debe ser un número positivo"
            }),
            z.number({
                required_error: "Categoria del producto es requerida",
            }).int({
                message: "La categoria del producto debe ser un número entero"
            }).positive({
                message: "La categoria del producto debe ser un número positivo"
            }),
        ],{
            invalid_type_error: "Categoria del producto debe ser un número entero positivo",
            required_error: "Categoria del producto es requerida",
        }),
    precio: z
        .union([
            z.number({
                invalid_type_error: "Precio del producto debe ser un número",
                required_error: "Precio del producto es requerido",
            }).positive({
                message: "El precio del producto debe ser un número positivo"
            }),
            z.string({
                required_error: "Precio del producto es requerido",
            }).regex(/^\d+(\.\d+)?$/, {
                message: "El precio del producto debe ser un número positivo"
            })
        ],{
            invalid_type_error: "Precio del producto debe ser un número positivo",
            required_error: "Precio del producto es requerido",
        }),
    imagen_default: z
        .any()
        // .refine(
        //     (file) =>{
        //         console.log(file);
        //         file?.size >= 5000000
        //     }, "La imagen no puede pesar más de 5MB")
        // .refine(
        //     (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        //     "Only .jpg, .jpeg, .png and .webp formats are supported."
        // )
        .optional(),
    status: z
        .union([
            z.boolean({
                invalid_type_error: "Estado del producto debe ser un booleano",
            }),
            z.string({
                required_error: "Estado del producto es requerido",
            }).refine(value => {
                if (value === "true" || value === "false") {
                    return true;
                }
            }, {
                message: "El estado del producto debe ser 'true' como string"
            })
        ]).optional(),
});
