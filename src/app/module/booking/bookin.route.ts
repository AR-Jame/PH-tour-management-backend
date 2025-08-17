import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { zodValidation } from "../../middlewares/validationRequest";
import { createBookingZodSchema, updateBookingZodSchema } from "./booking.validation";
import { bookingControllers } from "./booking.controller";

const router = Router();

router.post('/',
    checkAuth(...Object.values(Role)),
    zodValidation(createBookingZodSchema),
    bookingControllers.createBooking

);

router.get("/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    bookingControllers.getAllBookings
);


router.get("/my-bookings",
    checkAuth(...Object.values(Role)),
    bookingControllers.getUserBookings
);

router.get("/:bookingId",
    checkAuth(...Object.values(Role)),
    bookingControllers.getSingleBooking
);

router.patch("/:bookingId/status",
    checkAuth(...Object.values(Role)),
    zodValidation(updateBookingZodSchema),
    bookingControllers.updateBookingStatus
);

export const bookingRoutes = router;