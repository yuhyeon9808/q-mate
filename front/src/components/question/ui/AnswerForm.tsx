'use client';
import React, { useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import CloseButton from '@/components/common/CloseButton';
import { Button } from '@/components/common/Button';
import { Loader2 } from 'lucide-react';
import RatingModal from '../RatingModal';
import Link from 'next/link';
import TextTextarea, { TextTextareaRef } from './TextTextarea';
import { useSelectedStore } from '@/store/useSelectedStore';
import ConfirmModal from '@/components/common/ConfirmModal';
import { ratingQuestion } from '@/api/questions';
import { useRateQuestion } from '@/hooks/useQuestions';
import { ErrorToast, SuccessToast } from '@/components/common/CustomToast';

type AnswerFormProps = {
  mode: 'create' | 'edit';
  questionText: string;
  onSubmit: (content: string) => Promise<void> | void;
  submitting?: boolean;
  initialValue?: string;
  questionId?: number;
};

export default function AnswerForm({
  questionText,
  mode,
  onSubmit,
  submitting = false,
  initialValue = '',
  questionId,
}: AnswerFormProps) {
  const router = useRouter();
  const textareaRef = useRef<TextTextareaRef>(null);
  // const [ratingOpen, setRatingOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pathName = usePathname();
  const fromToday = pathName.startsWith('/question/detail');
  const [isEmpty, setIsEmpty] = useState(initialValue.trim().length === 0);
  const canSubmit = !submitting && !isEmpty;
  const setSelectedMenu = useSelectedStore((state) => state.setSelectedMenu);
  const rateMutate = useRateQuestion();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const submitText = textareaRef.current?.getValue() ?? '';
    if (!submitText) return;
    await onSubmit(submitText);

    if (mode === 'create') {
      setConfirmOpen(false);
    } else {
      setConfirmOpen(false);
      router.push(fromToday ? '/record' : '/question/list');
    }
  };
  // const handleRating = (questionId: number, isLike: boolean) => {
  //   // setRatingOpen(false);
  //   rateMutate.mutate(
  //     { questionId, isLike },
  //     {
  //       onSuccess: () => {
  //         SuccessToast('평가가 완료되었어요');
  //         router.push(fromToday ? '/record' : '/question/list');
  //       },
  //       onError: () => {
  //         ErrorToast('평가에 실패했어요.');
  //       },
  //     },
  //   );
  // };

  return (
    <>
      {/* 상단 닫기 버튼 (모바일 헤더) */}
      <div className="w-full relative top-0 h-[70px] flex justify-center items-center sm:hidden">
        <Link href="/main" onClick={() => setSelectedMenu('home')}>
          <span
            className="site-logo inline-block w-[109px] h-[35px]"
            role="img"
            aria-label="큐메이트"
          />
        </Link>
        <div className="absolute right-5 sm:hidden">
          <CloseButton onClick={() => router.push('/question/list')} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center h-full bg-gradient-sub ">
        <div className="flex flex-col gap-3">
          <span className="font-bold text-24 text-center pb-3 text-theme-primary md:w-[390px] w-[310px]">
            {questionText}
          </span>

          <TextTextarea
            ref={textareaRef}
            defaultValue={initialValue}
            placeholder="오늘의 질문에 답변해보세요!"
            textLength={(t) => setIsEmpty(t.length === 0)}
          />
        </div>

        <div className="pt-5 flex gap-x-7">
          <Button variant="outline" size="lg" asChild className="md:w-[180px] w-[140px]">
            <Link href={fromToday ? '/record' : '/question/list'}>취소하기</Link>
          </Button>

          <Button
            size="lg"
            className="md:w-[180px] w-[140px]"
            onClick={() => setConfirmOpen(true)}
            disabled={!canSubmit}
            aria-busy={submitting}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === 'create' ? (
              '답변하기'
            ) : (
              '수정하기'
            )}
          </Button>
        </div>
      </div>
      <ConfirmModal
        defaultStyle
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={mode === 'create' ? '답변을 완료하시겠습니까?' : '수정을 완료하시겠습니까?'}
        onConfirm={() => handleSubmit()}
      />
      {/* <RatingModal
        open={ratingOpen}
        onOpenChange={setRatingOpen}
        onLike={() => handleRating(questionId!, true)}
        onDislike={() => handleRating(questionId!, false)}
      /> */}
    </>
  );
}
