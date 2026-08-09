"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { axiosClient } from "@/lib/api/axios-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function TerminateContractPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const contractId = Number(params?.id);

  const [finalElectric, setFinalElectric] = useState("");
  const [finalWater, setFinalWater] = useState("");
  const [terminationReason, setTerminationReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const electric = Number(finalElectric);
    const water = Number(finalWater);

    if (!finalElectric || isNaN(electric) || electric < 0) {
      toast.error("Vui lòng nhập số điện cuối hợp lệ!");
      return;
    }
    if (!finalWater || isNaN(water) || water < 0) {
      toast.error("Vui lòng nhập số nước cuối hợp lệ!");
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosClient.post(`/contract/${contractId}/terminate`, {
        finalElectric: electric,
        finalWater: water,
        terminationReason: terminationReason || undefined,
      });
      toast.success("Chấm dứt hợp đồng thành công!");
      router.push(`/contracts/${contractId}`);
      router.refresh();
    } catch {
      // axiosClient đã tự hiển thị toast lỗi
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6">
      <Button variant="ghost" onClick={() => router.back()} type="button">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Chấm dứt hợp đồng #{contractId}</CardTitle>
          <CardDescription>
            Nhập số công tơ cuối kỳ và lý do chấm dứt. Hợp đồng sẽ được đóng và
            phòng được trả trạng thái trống.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="electric">Số điện cuối (kWh) *</Label>
                <Input
                  id="electric"
                  type="number"
                  min={0}
                  placeholder="VD: 1250"
                  value={finalElectric}
                  onChange={(e) => setFinalElectric(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="water">Số nước cuối (m³) *</Label>
                <Input
                  id="water"
                  type="number"
                  min={0}
                  placeholder="VD: 35"
                  value={finalWater}
                  onChange={(e) => setFinalWater(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Lý do chấm dứt</Label>
              <Textarea
                id="reason"
                placeholder="VD: Hết hạn hợp đồng, khách trả phòng..."
                value={terminationReason}
                onChange={(e) => setTerminationReason(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Xác nhận chấm dứt
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}