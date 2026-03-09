import {z} from "zod";


export const verfiySchemaValidation = z.object({

    code:z.string().length(6,'Invalid code')

});