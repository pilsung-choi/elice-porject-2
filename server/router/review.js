import express from 'express';
import 'express-async-errors';
import * as reviewController from '../controller/review.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/review/:farmId', isAuth, reviewController.review); //리뷰 등록

router.get('/reviewlist', reviewController.reviewList); // 모든 리뷰 정보 조회

router.get('/review', isAuth, reviewController.getReveiwData); // 본인 리뷰 조회

router.delete('/review', isAuth, reviewController.reviewDrop); //리뷰 삭제

router.patch('/review',isAuth,  reviewController.reserveUpdate); //리뷰 수정

export default router;
