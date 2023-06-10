import * as z from 'zod';

export default z.object({
    username: z
        .string({
            required_error: 'Username is required',
            invalid_type_error: 'Username must be a string',
        })
        .min(2, 'Username is too short')
        .max(50, "Username isn't supposed to be this long"),
    password: z
        .string({
            required_error: 'Password is required',
            invalid_type_error: 'Password must be a string',
        })
        .min(8, 'Password is too short')
        .max(50, "No, your password isn'n so long"),
});
