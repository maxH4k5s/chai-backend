// asyncHandler ek wrapper function hai
// Iska kaam hai: async route handlers ke errors ko safely Express tak pahunchana
const asyncHandler = (requestHandler) => {

    // ⚠️ IMPORTANT:
    // Express ko hamesha (req, res, next) wala function chahiye
    // Isliye yahan hum ek naya middleware RETURN kar rahe hain
    return (req, res, next) => {

        // Promise.resolve ka matlab:
        // - agar requestHandler async hai → promise milega
        // - agar requestHandler sync error throw kare → woh bhi promise reject ban jayega
        // Isse dono case ek jaise handle ho jaate hain
        Promise
            .resolve(requestHandler(req, res, next))

            // Agar koi bhi error aaya (throw / reject),
            // to next(err) call hoga
            // next(err) = Express ka standard error flow
            .catch((err) => next(err))
    }
}

// asyncHandler ko export kar rahe hain
// taaki routes me use kar saken:
// router.get("/", asyncHandler(myAsyncController))
export { asyncHandler }






// second method with async/await
// const asyncHandler = (fn) => {}
// const asyncHandler = (fn) => {() => {}}
// const asyncHandler = (fn) => async () => {}

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }