'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Pie, PieChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { Chart } from '@/types/chart';

const categoryColors: Record<string, string> = {
  취미: 'var(--chart-2)',
  선호도: 'var(--chart-3)',
  추억: 'var(--chart-4)',
  목표: 'var(--chart-5)',
  '기념일(100일)': 'var(--chart-6)',
  '기념일(N주년)': 'var(--chart-7)',
  '미래 계획': 'var(--chart-8)',
  '상황 가정': 'var(--chart-1)',
  기타: 'var(--chart-9)',
};

export function Chart({ data }: { data: Chart }) {
  const mergedCategories = Object.values(
    data.categories.reduce((acc, item) => {
      const name = item.categoryName;
      if (!acc[name]) {
        acc[name] = {
          category: name,
          visitors: item.likeCount,
          fill: categoryColors[name] ?? 'var(--chart-9)',
        };
      } else {
        acc[name].visitors += item.likeCount;
      }
      return acc;
    }, {} as Record<string, { category: string; visitors: number; fill: string }>),
  );

  const chartConfig = { visitors: { label: '좋아요' } } as const;

  return (
    <Card className="flex flex-col items-center bg-none border-none shadow-none py-6 px-0 !gap-0">
      <p className="text-16 font-bold text-center mb-4">
        큐메이트와 함께 한 저번달 <br /> 좋아해주신 질문들을 분석해 봤어요!
      </p>

      <CardContent className="p-0 flex justify-center mb-4">
        <div className="flex justify-center items-center min-h-[220px] min-w-[220px]">
          <ChartContainer
            config={chartConfig}
            className="flex justify-center items-center w-full h-full"
          >
            <PieChart width={200} height={200}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={mergedCategories}
                dataKey="visitors"
                nameKey="category"
                innerRadius={60}
                outerRadius={90}
                isAnimationActive={false}
              />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm pb-8">
        {mergedCategories.map((item) => (
          <div key={item.category} className="flex items-center gap-1">
            <div className="w-6 h-3" style={{ backgroundColor: item.fill }} />
            <span>{item.category}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
