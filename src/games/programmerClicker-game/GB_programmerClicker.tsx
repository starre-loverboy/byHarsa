/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { ITEMLIST, CONSUMABLELIST, UPGRADELIST, type items } from "./PCLIST";
import { useState, useEffect, useMemo } from "react";
import Decimal from "break_infinity.js";
import GlobalNav from "../../components/GlobalNav";
import GlobalFooter from "../../components/GlobalFooter";

function GB_programmerClicker() {
    interface WholeGameData {
        loc: Decimal;
        itemsList: typeof ITEMLIST;
        consumablesList: typeof CONSUMABLELIST;
        upgradesList: typeof UPGRADELIST;
    }

    const [wholeGame, setWholeGame] = useState<WholeGameData>(() => {
        const savedWholeGame = localStorage.getItem("whole-game")
        return savedWholeGame ? JSON.parse(savedWholeGame, (key, value) => {
            switch (key) {
                case "loc":
                case "clickPower":
                case "price":
                case "locPerSec":
                case "amount":
                    return new Decimal(value)
                default:
                    return value
            }
        }) : {
            clickPower: new Decimal(1),
            loc: new Decimal(0),
            itemsList: ITEMLIST,
            consumablesList: CONSUMABLELIST,
            upgradesList: UPGRADELIST,
        }
    })
    const [globalTimer, setGlobalTimer] = useState(0);
    const [clickPowerTexts, setClickPowerTexts] = useState<{ id: number, value: Decimal, left: number, top: number }[]>([])
    const [buyMultiplier, setBuyMultiplier] = useState(1)

    const itemTotal = useMemo(() => wholeGame.itemsList.reduce((a: Decimal, b) => a.add(b.amount), new Decimal(0)), [wholeGame.itemsList])
    const checkedClickPower = useMemo(() => {
        let base = new Decimal(1)

        if (wholeGame.upgradesList[0].bought) base = base.mul(itemTotal.add(1).sqr()).mul(2)
        if (wholeGame.upgradesList[2].bought) base = base.mul(5)
        if (wholeGame.upgradesList[6].bought) base = base.mul(itemTotal.add(1).sqr()).mul(10)
        return base
    }, [itemTotal, wholeGame.upgradesList])

    const checkConsumableClickIncrease = (prev: WholeGameData) => {
        if (prev.consumablesList[2].active) return new Decimal(6)
        else if (prev.consumablesList[0].active) return new Decimal(2)
        return new Decimal(1)
    }
    const checkConsumablePassiveIncrease = (prev: WholeGameData) => {
        if (prev.consumablesList[5].active) return new Decimal(24)
        else if (prev.consumablesList[4].active) return new Decimal(6)
        else if (prev.consumablesList[3].active) return new Decimal(3)
        else if (prev.consumablesList[1].active) return new Decimal(2)
        return new Decimal(1)
    }
    const checkPriceMultiplier = (price: Decimal) => {
        let total = new Decimal(0);
        for (let int = 0; int < buyMultiplier; int++) {
            total = total.add(price)
            price = price.mul(wholeGame.upgradesList[5].bought ? 1.1 : 1.2)
        }
        return [total.floor(), price]
    }
    const handleClick = () => {
        const id = Date.now()
        setWholeGame(prev => ({
            ...prev,
            loc: prev.loc.add(checkConsumableClickIncrease(prev).mul(checkedClickPower))
        }));
        setClickPowerTexts((prev) => [{ id: id, value: checkConsumableClickIncrease(wholeGame).mul(checkedClickPower), left: Math.random() * 100, top: Math.random() * 100}, ...prev])
        setTimeout(() => {
            setClickPowerTexts((prev) => prev.filter((text) => text.id !== id))
        }, 500)
    };
    const handleBuyItem = (index: number) => {
        const loc = wholeGame.loc.floor()
        const price = wholeGame.itemsList[index].price.floor()
        const priceList = checkPriceMultiplier(price)
        if (loc.lt(priceList[0])) return
        setWholeGame(prev => ({
            ...prev,
            itemsList: prev.itemsList.map((item, i) => i === index ? { ...item, amount: item.amount.add(buyMultiplier), price: priceList[1] } : item),
            loc: loc.minus(priceList[0])
        }));
    };
    const lastOwnedUpgradeIndex = useMemo(() => wholeGame.upgradesList.findIndex((upgrade) => !upgrade.bought), [wholeGame.upgradesList])
    const handleBuyUpgrade = (index: number) => {
        if (wholeGame.loc.lt(wholeGame.upgradesList[index].price)) return
        if (index > lastOwnedUpgradeIndex) return
        if (wholeGame.upgradesList[index].bought) return
        setWholeGame((prev) => ({
            ...prev,
            upgradesList: prev.upgradesList.map((upgrade, i) => (i === index ? { ...upgrade, bought: true } : upgrade)),
            loc: prev.loc.minus(wholeGame.upgradesList[index].price)
        }))
    }
    const handleBuyConsumable = (index: number) => {
        if (wholeGame.loc.lt(wholeGame.consumablesList[index].price)) return
        if (wholeGame.consumablesList[index].active) return
        setWholeGame((prev) => ({
            ...prev,
            consumablesList: prev.consumablesList.map((consumable, i) => (i === index ? { ...consumable, active: true, startTime: globalTimer } : consumable)),
            loc: prev.loc.minus(wholeGame.consumablesList[index].price)
        }))
    }
    useEffect(() => {
        setWholeGame((prev) => ({
            ...prev,
            consumablesList: prev.consumablesList.map((consumable) => {
                if (!consumable.active) return consumable
                const elapsedTime = globalTimer - consumable.startTime
                return ({
                    ...consumable,
                    active: consumable.duration > elapsedTime
                })
            })
        }))
    }, [globalTimer])

    const passiveLocPerSecond = useMemo(() => {
        return wholeGame.itemsList.reduce(
            (sum, item) =>
                item.amount.gt(0)
                    ? sum.add(item.locPerSec.mul(item.amount))
                    : sum,
            new Decimal(0)
        );
    }, [wholeGame.itemsList]);

    const checkUpgradePassiveIncrease = (prev: WholeGameData) => {
        if (prev.upgradesList[4].bought) return 6
        if (prev.upgradesList[3].bought) return 2
        return 1
    }
    useEffect(() => {
        setWholeGame(prev => ({
            ...prev,
            loc: prev.loc.add(checkConsumablePassiveIncrease(prev).mul(passiveLocPerSecond).mul(checkUpgradePassiveIncrease(prev)))
        }));
    }, [globalTimer]);
    useEffect(() => {
        const id = setInterval(() => {
            setGlobalTimer(prev => prev + 1);
        }, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        localStorage.setItem("whole-game", JSON.stringify(wholeGame));
    }, [wholeGame]);

    const formatNumber = (num: Decimal): string => {
        if (num.lt(1000)) return num.floor().toString()

        const numTypeList = ["k", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "octillion", "nonillion"]
        const exponent = Math.floor(num.log10())
        const group = Math.floor(exponent / 3) - 1

        if (group >= numTypeList.length) return num.toExponential(2)

        const result = num.div(Decimal.pow(1000, group + 1))
        return `${result.toFixed(2)} ${numTypeList[group]}`
    }

    const lastOwnedItemIndex = useMemo(() => wholeGame.itemsList.findIndex((item) => item.amount.equals(0)), [wholeGame.itemsList])
    const renderItem = (item: items, index: number) => {
        if (index === lastOwnedItemIndex + 1) {
            return (<div key={index} className="items-list-item locked">
                <h2>{item.name}</h2>
                <p>{formatNumber(item.locPerSec)} LoC/S</p>
                <p>{formatNumber(item.price)} LoC</p>
                <p className="amount-item-pc">{item.amount.equals(0) ? "" : formatNumber(item.amount)}</p>
            </div>)
        }
        if (index >= lastOwnedItemIndex + 2) {
            if (index >= lastOwnedItemIndex + 3) {
                if (index === lastOwnedItemIndex + 4) return <div className="more-items-div" key={index}>More items await...</div>
                return null
            }
            return (
                <div className="items-list-item empty" key={index}>
                </div>
            )
        }
        return (
            <div className={wholeGame.loc.gte(checkPriceMultiplier(item.price)[0]) ? "items-list-item affordable" : "items-list-item"} key={index} onClick={() => handleBuyItem(index)}>
                <h2>{item.name}</h2>
                <p>{formatNumber(item.locPerSec)} LoC/S</p>
                <p>{formatNumber(checkPriceMultiplier(item.price)[0])} LoC</p>
                <p className="amount-item-pc">{item.amount.equals(0) ? "" : formatNumber(item.amount)}</p>
            </div>
        )
    }

    // second upgrade, auto formatter
    useEffect(() => {
        if (!wholeGame.upgradesList[1].bought) return
        setWholeGame((prev) => ({
            ...prev,
            itemsList: prev.itemsList.map((item: items) => ({ ...item, locPerSec: item.locPerSec.mul(2) }))
        }))
    }, [wholeGame.upgradesList[1].bought])

    return (
        <div className="game-board">
            <h1 className="mainTitle-h1">Programmer Clicker</h1>
            <div className="mainBoard pc">
                <div className="main-laptop">
                    <p className="main-loc-p">LoC: {formatNumber(wholeGame.loc)}</p>
                    <button className="clicker-pc" onClick={handleClick}>
                        💻
                        <div className="click-texts-div">
                            {clickPowerTexts.map((text) => (
                                <p className="click-power-p" style={{position: 'absolute', top: `${text.top}%`, left: `${text.left}%`}}>{`+${formatNumber(text.value)}`}</p>
                            ))}
                        </div>
                    </button>
                    <p className="main-loc-p">LoC per second: {formatNumber(checkConsumablePassiveIncrease(wholeGame).mul(passiveLocPerSecond).mul(checkUpgradePassiveIncrease(wholeGame)))}
                    </p>
                </div>
                <div className="misc-list-pc">
                    <div className="consumables-list-pc">
                        <h2 className="buyable-section-title consumable">Consumable Store</h2>
                        <div className="consumables-content-list-pc">
                            {wholeGame.consumablesList.map((consumable, index) => (
                                <div onClick={() => handleBuyConsumable(index)} className={consumable.active ? "consumables-content-div active" : wholeGame.loc.gte(consumable.price) ? "consumables-content-div" : "consumables-content-div insufficient"} key={index}>
                                    <h2>{consumable.name}</h2>
                                    <p>{formatNumber(consumable.price)}</p>
                                    <p>{consumable.description}</p>
                                    <p>{consumable.duration}s (duration)</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="upgrades-list-pc">
                        <h2 className="buyable-section-title upgrade">Upgrade Store</h2>
                        <div className="upgrades-content-list-pc">
                            {wholeGame.upgradesList.map((upgrade, index) => (
                                <div className={lastOwnedUpgradeIndex + 1 <= index ? "upgrades-content-div locked" : upgrade.bought ? "upgrades-content-div bought" : wholeGame.loc.gte(upgrade.price) ? "upgrades-content-div" : "upgrades-content-div insufficient"} key={index} onClick={() => handleBuyUpgrade(index)}>
                                    <h2>{upgrade.name}</h2>
                                    <p>{formatNumber(upgrade.price)}</p>
                                    <p>{upgrade.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="items-list-container">
                <h2 className="buyable-section-title">Item Store</h2>
                <div className="buy-multiplier-pc">
                    <input onChange={(e) => setBuyMultiplier(Number(e.target.value))} type="radio" id="buy-1" name="buy-multiplier" value="1" defaultChecked />
                    <label htmlFor="buy-1">1×</label>
                    <input onChange={(e) => setBuyMultiplier(Number(e.target.value))} type="radio" id="buy-2" name="buy-multiplier" value="2" />
                    <label htmlFor="buy-2">2×</label>
                    <input onChange={(e) => setBuyMultiplier(Number(e.target.value))} type="radio" id="buy-5" name="buy-multiplier" value="5" />
                    <label htmlFor="buy-5">5×</label>
                    <input onChange={(e) => setBuyMultiplier(Number(e.target.value))} type="radio" id="buy-10" name="buy-multiplier" value="10" />
                    <label htmlFor="buy-10">10×</label>
                    <input onChange={(e) => setBuyMultiplier(Number(e.target.value))} type="radio" id="buy-50" name="buy-multiplier" value="50" />
                    <label htmlFor="buy-50">50x</label>
                </div>
                <div className="items-list-pc">
                    {wholeGame.itemsList.map((item, index) => (
                        renderItem(item, index)
                    ))}
                </div>
            </div>
            <GlobalNav />
            <GlobalFooter />
        </div>
    );
}

export default GB_programmerClicker;