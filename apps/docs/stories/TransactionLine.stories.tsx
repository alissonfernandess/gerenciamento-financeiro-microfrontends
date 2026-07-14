
import type { Meta, StoryObj } from '@storybook/react';
import { TransactionLine } from "../../../packages/ui/src/components/TransactionLine";
import { FaPix } from 'react-icons/fa6';

const meta = {
  title: "TransactionLine",
  component: TransactionLine,
  tags: ["autodocs"],

} satisfies Meta<typeof TransactionLine>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    date: "2024-08-12",
    Icon: FaPix,
    transactionType: "pix",
    value: 200,
    operationBank: "deposit",
    hasCurrencySymbol: true
  },
};
