import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function RentalCostEstimator() {
  const [totalPeople, setTotalPeople] = useState("");
  const [nights, setNights] = useState("2");
  const [wantsFood, setWantsFood] = useState(false);
  const [wantsPool, setWantsPool] = useState(false);
  const [isSummer, setIsSummer] = useState(false);
  const [isPartner, setIsPartner] = useState(true);
  const [totalCost, setTotalCost] = useState(null);
  const [totalMeals, setTotalMeals] = useState(null);

  const getBaseCostPerPerson = (nights) => {
    const n = parseInt(nights);
    if (n <= 2) return 95;
    if (n === 3) return 110;
    if (n === 4) return 125;
    if (n === 5) return 140;
    return 140 + (n - 5) * 15;
  };

  const calculateCost = () => {
    let numPeople = parseInt(totalPeople) || 0;
    const numNights = parseInt(nights) || 2;

    if (isSummer) {
      numPeople = Math.max(numPeople, 50);
    } else {
      numPeople = Math.max(numPeople, 30);
    }

    const baseCostPerPerson = getBaseCostPerPerson(numNights);
    const lodgingCost = numPeople * baseCostPerPerson;

    let foodCost = 0;
    if (wantsFood) {
      const meals = numNights * 2 - 1;
      setTotalMeals(meals);
      foodCost = meals * numPeople * 6;
    } else {
      setTotalMeals(null);
      foodCost = (numNights + 1) * 100;
    }

    const poolCost = isSummer && wantsPool ? 100 : 0;

    let discountMultiplier = 1;
    if (numPeople > 100) {
      discountMultiplier = 0.80;
    } else if (numPeople > 50) {
      discountMultiplier = 0.90;
    }

    let discountedLodging = lodgingCost * discountMultiplier;

    let total = discountedLodging + foodCost + poolCost;

    if (!isPartner) {
      total *= 1.2; // 20% more if not a partner
    }

    setTotalCost(Math.round(total));
  };

  useEffect(() => {
    if (totalPeople !== "" && nights !== "") {
      calculateCost();
    }
  }, [totalPeople, nights, wantsFood, wantsPool, isSummer, isPartner]);

  const handleNumberInput = (value, setter) => {
    const numericValue = value.replace(/^0+(?!$)/, "");
    if (/^\d*$/.test(numericValue)) {
      setter(numericValue);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold">Camp Rental Cost Estimator</h1>

      <div className="flex items-center justify-between">
        <label>Is your group a camp partner?</label>
        <Switch checked={isPartner} onCheckedChange={setIsPartner} />
      </div>

      <div className="flex items-center justify-between">
        <label>Is this during June-August?</label>
        <Switch checked={isSummer} onCheckedChange={setIsSummer} />
      </div>

      <div>
        <label>Total Number of People (Campers + Leaders)</label>
        <Input
          type="text"
          value={totalPeople}
          onChange={(e) => handleNumberInput(e.target.value, setTotalPeople)}
        />
      </div>

      <div>
        <label>Number of Nights</label>
        <Input
          type="text"
          value={nights}
          onChange={(e) => handleNumberInput(e.target.value, setNights)}
        />
      </div>

      <div className="flex items-center justify-between">
        <label>Camp Provides Food?</label>
        <Switch checked={wantsFood} onCheckedChange={setWantsFood} />
      </div>

      {isSummer && (
        <div className="flex items-center justify-between">
          <label>Use Pool? ($100)</label>
          <Switch checked={wantsPool} onCheckedChange={setWantsPool} />
        </div>
      )}

      <Button onClick={calculateCost}>Estimate Cost</Button>

      {totalCost !== null && (
        <div className="mt-4 text-lg font-semibold">
          <div>Estimated Cost: ${totalCost}</div>
          {totalMeals !== null && (
            <div>Meals Provided per Person: {totalMeals}</div>
          )}
        </div>
      )}
    </div>
  );
}
