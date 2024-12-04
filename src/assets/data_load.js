import cards from './v2_Cards.json' with { type: "json" };
import monsters from './v2_Monsters.json' with { type: "json" };
// import cards from './v2_Cards_one.json' with { type: "json" };
let tiers = [ "Bronze", "Silver", "Gold", "Diamond", "Legendary" ];
const range = (start, end) => Array.from({ length: end - start }, (_, i) => start + i);

function itemAttributeSummary(itemAttribute, rawItemCard) {
    // Items have attributes. e.g. "SlowAmount"
    // These vary by tier. However occasionally, if a value remains the same between tiers, it is not repeated.
    // Furthermore, items start at certain tiers.
    // Given an item, and an attribute key,
    // this function is to return the values of the attribute, starting at the item's starting tier, repeating values in the event they are skipped
    // e.g. [2, 2, 3, 4] (for an item starting at Silver tier)
    // e.g. [1, 2, 2, 2] (for an item that improved at Silver, but never again)
    // Legendary items are a surprise... Not sure what to do with these

    let startingTierIndex = tiers.indexOf(rawItemCard.StartingTier);
    let attributeSummary = Array(startingTierIndex).fill(undefined);
    for (let tierIndex of range(startingTierIndex, tiers.length))
        attributeSummary.push(rawItemCard.Tiers[tiers[tierIndex]]?.Attributes[itemAttribute] ?? attributeSummary[attributeSummary.length - 1]);

    return attributeSummary;
}

function modifyAttribute(attributeValue, modifyObject)
{
    const modifyType = modifyObject["ModifyMode"]
    switch (modifyType) {
        case 'Multiply':
            const modifyValue = modifyObject["Value"]
            return attributeValue * modifyValue
        default:
            console.log(`Unsupported attribute modify type: ${modifyType}`);
    }
}

function deriveAbilityAttribute(index, subAttribute, rawItemCard) {
    return deriveAbilityOrAuraAttribute('Abilities', index, subAttribute, rawItemCard)
}

function deriveAuraAttribute(index, subAttribute, rawItemCard) {
    return deriveAbilityOrAuraAttribute('Auras', index, subAttribute, rawItemCard)
}

function deriveAbilityOrAuraAttribute(selector, index, subAttribute, rawItemCard) {
    // Given an ability index and attribute to resolve, return a string of all the values
    // e.g. index, 0, attribute 'targets', return 1/2/3/4
    const actionType = rawItemCard[selector][String(index)]["Action"]["$type"];
    const unknown = Array(5).fill("?")

    switch (actionType) {
        case 'TAuraActionPlayerModifyAttribute':
        case 'TAuraActionCardModifyAttribute':
        case 'TActionCardModifyAttribute': {
            switch (subAttribute) {
                case 'mod':
                case undefined:
                    const valueObject = rawItemCard[selector][String(index)]["Action"]["Value"]
                    const valueType = valueObject["$type"];
                    switch (valueType) {
                        case 'TReferenceValueCardAttribute':
                            const valueTargetType = valueObject["Target"]["$type"];
                            switch (valueTargetType) {
                                case 'TTargetCardSelf':
                                    let attributeSummary = itemAttributeSummary(valueObject["AttributeType"], rawItemCard)
                                    if (valueObject["Modifier"])
                                        return attributeSummary.map(x => modifyAttribute(x, valueObject["Modifier"]));
                                    return attributeSummary;
                                case 'TTargetCardSection':
                                    return Array(5).fill('?')
                                default:
                                    console.log(`Unsupported value target: ${valueTargetType}, for value type: ${valueType}, for attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                            }
                            break;
                        case 'TFixedValue':
                            return Array(5).fill(valueObject["Value"])
                        case 'TReferenceValueCardCount':
                            // Not a reliable implementation - only works for items at the time of writing - but a pretty difficult case to handle
                            var attributeSummary = Array(5).fill(1);
                            if (valueObject["Modifier"])
                                return attributeSummary.map(x => modifyAttribute(x, valueObject["Modifier"]));
                            return attributeSummary;
                        case 'TReferenceValuePlayerAttribute':
                            // Not a reliable implementation - only works for items at the time of writing - but a pretty difficult case to handle
                            var attributeSummary = Array(5).fill(1);
                            if (valueObject["Modifier"])
                                return attributeSummary.map(x => modifyAttribute(x, valueObject["Modifier"]));
                            return attributeSummary;
                        case 'TReferenceValueCardAttributeAggregate':
                                // Not a correct implementation - but not quite possible to handle is this scenario
                                return Array(5).fill('?');
                        default:
                            console.log(`Unsupported value type: ${valueType}, for attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                        break;
                    }
                    break;
                default:
                    console.log(rawItemCard["InternalName"]);

                    console.log(`Unsupported ability attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
            }
            break;
        }
        case 'TActionPlayerModifyAttribute': {
            switch (subAttribute) {
                case undefined:
                    const valueObject = rawItemCard[selector][String(index)]["Action"]["Value"];
                    const valueType = valueObject["$type"];
                    switch (valueType) {
                        case 'TFixedValue':
                            return Array(5).fill(valueObject["Value"])
                        case 'TReferenceValueCardAttribute':
                            const valueTargetType = valueObject["Target"]["$type"];
                            switch (valueTargetType) {
                                case 'TTargetCardSelf':
                                    let attributeSummary = itemAttributeSummary(valueObject["AttributeType"], rawItemCard)
                                    if (valueObject["Modifier"])
                                        return attributeSummary.map(x => modifyAttribute(x, valueObject["Modifier"]));
                                    return attributeSummary;
                                case 'TTargetCardSection':
                                    return Array(5).fill('?')
                                default:
                                    console.log(`Unsupported value target: ${valueTargetType}, for value type: ${valueType}, for attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                            }
                            break;
                        default:
                            console.log(`Unsupported value type: ${valueType}, for attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                        break;
                    }
                    break;
                default:
                    console.log(`Unsupported ability attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                break;
            }
            break;
        }
        case 'TActionGameSpawnCards': {
            switch (subAttribute) {
                case undefined:
                    // TODO: Cater for multiple types of SpawnContexts
                    const limitObject = rawItemCard[selector][String(index)]["Action"]["SpawnContext"]["Limit"];
                    const limitType = limitObject["$type"];
                    switch (limitType) {
                        case 'TFixedValue':
                            return Array(5).fill(limitObject["Value"])
                        default:
                            console.log(`Unsupported limit type: ${limitType}, for attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                        break;
                    }
                    break;
                default:
                    console.log(`Unsupported ability attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                break;
            }
            break;
        }
        case 'TActionPlayerDamage': {
            switch (subAttribute) {
                case undefined: return itemAttributeSummary("DamageAmount", rawItemCard);
                default:
                    console.log(`Unsupported ability attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                break;
            }
            break;
        }
        case 'TActionPlayerShieldApply': {
            switch (subAttribute) {
                case undefined: return itemAttributeSummary("ShieldApplyAmount", rawItemCard);
                default:
                    console.log(`Unsupported ability attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                break;
            }
            break;
        }
        case 'TActionPlayerHeal': {
            switch (subAttribute) {
                case 'mod': // Todo: This will likely need fixing in the future
                case undefined: return itemAttributeSummary("HealAmount", rawItemCard);
                default:
                    console.log(`Unsupported ability attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                break;
            }
            break;
        }
        case 'TActionPlayerBurnApply': {
            switch (subAttribute) {
                case undefined: return itemAttributeSummary("BurnApplyAmount", rawItemCard);
                default:
                    console.log(`Unsupported ability attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                break;
            }
            break;
        }
        case 'TActionPlayerPoisonApply': {
            switch (subAttribute) {
                case undefined: return itemAttributeSummary("PoisonApplyAmount", rawItemCard);
                default:
                    console.log(`Unsupported ability attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                break;
            }
            break;
        }
        case 'TActionPlayerJoyApply': {
            switch (subAttribute) {
                case 'mod': // Todo: This will likely need fixing in the future
                case undefined: return itemAttributeSummary("JoyApplyAmount", rawItemCard);
                default:
                    console.log(`Unsupported ability attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                break;
            }
            break;
        }
        case 'TActionCardHaste': {
            switch (subAttribute) {
                case undefined: return itemAttributeSummary("HasteAmount", rawItemCard).map(x => x / 1000);
                case 'targets': return itemAttributeSummary("HasteTargets", rawItemCard);
                default:
                    console.log(`Unsupported ability attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                break;
            }
            break;
        }
        case 'TActionCardCharge': {
            switch (subAttribute) {
                case undefined: return itemAttributeSummary("ChargeAmount", rawItemCard).map(x => x / 1000);
                case 'targets': return itemAttributeSummary("ChargeTargets", rawItemCard);
                default:
                    console.log(`Unsupported ability attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                break;
            }
            break;
        }
        case 'TActionCardSlow': {
            switch (subAttribute) {
                case undefined: return itemAttributeSummary("SlowAmount", rawItemCard).map(x => x / 1000);
                case 'targets': return itemAttributeSummary("SlowTargets", rawItemCard);
                default:
                    console.log(`Unsupported ability attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                break;
            }
            break;
        }
        case 'TActionCardFreeze': {
            switch (subAttribute) {
                case undefined: return itemAttributeSummary("FreezeAmount", rawItemCard).map(x => x / 1000);
                case 'targets': return itemAttributeSummary("FreezeTargets", rawItemCard);
                default:
                    console.log(`Unsupported ability attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                break;
            }
            break;
        }
        case 'TActionCardReload': {
            switch (subAttribute) {
                case undefined: return itemAttributeSummary("ReloadAmount", rawItemCard);
                case 'targets': return itemAttributeSummary("ReloadTargets", rawItemCard);
                default:
                    console.log(`Unsupported ability attribute: ${subAttribute ?? "default"}, for ability type: ${actionType}`);
                break;
            }
            break;
        }
        default: {
            console.log(rawItemCard["InternalName"]);
            console.log(`Unsupported ability type: ${actionType}`);
        }
    }

    return unknown;
}

function formatTooltip(tooltip, rawItemCard) {
    // Given a tooltip, e.g. "Slow {ability.0.targets} item for {ability.0} second(s)."
    // Return a formatted version, e.g. "Slow 1/2/3/4 item for 2 second(s)."

    // Format "ability" tags
    let regex = /\{ability.*?\}/g;
    let matches = tooltip.match(regex) ?? [];
    for (let match of matches)
    {
        let matchTrimmed = match.slice(1, match.length - 1)

        let attributeModifier = matchTrimmed?.includes("|") ? matchTrimmed.split("|")[1] : undefined
        if (attributeModifier) {
            matchTrimmed = matchTrimmed.replace(`|${attributeModifier}`, "")
        }

        let split = matchTrimmed.split(".")
        let abilityIndex = split[1]
        let abilityAttribute = split.length > 2 ? split[2] : undefined

        // Get ability value summary
        let abilitySummary = deriveAbilityAttribute(abilityIndex, abilityAttribute, rawItemCard).map(x => x ?? "-")

        if (attributeModifier == "%")
            abilitySummary = abilitySummary.map(x => Number.isInteger(x) ? `${(x*100).toString()}%` : "-%" )

        // Is every element equal?
        if (abilitySummary.every(x => x == abilitySummary[0]))
            tooltip = tooltip.replace(match, abilitySummary[0])
        else
            tooltip = tooltip.replace(match, abilitySummary.join("/"))
    }

    // TODO! Above and below loops are pretty much identical - abstract this!

    // Format "aura" tags
    regex = /\{aura.*?\}/g;
    matches = tooltip.match(regex) ?? [];
    for (let match of matches)
    {
        let matchTrimmed = match.slice(1, match.length - 1)

        let attributeModifier = matchTrimmed?.includes("|") ? matchTrimmed.split("|")[1] : undefined
        if (attributeModifier) {
            matchTrimmed = matchTrimmed.replace(`|${attributeModifier}`, "")
        }

        let split = matchTrimmed.split(".")
        let abilityIndex = split[1]
        let abilityAttribute = split.length > 2 ? split[2] : undefined

        // Get ability value summary
        let abilitySummary = deriveAuraAttribute(abilityIndex, abilityAttribute, rawItemCard).map(x => x ?? "-")

        if (attributeModifier == "%"){
            abilitySummary = abilitySummary.map(x => Number.isInteger(x) ? `${(x*100).toString()}%` : "-%" )
        }

        // Is every element equal?
        if (abilitySummary.every(x => x == abilitySummary[0]))
            tooltip = tooltip.replace(match, abilitySummary[0])
        else
            tooltip = tooltip.replace(match, abilitySummary.join("/"))
    }

    return tooltip;
}

function formatSimpleAttributes(cooldowns) {
    // sometimes cooldowns are "inherited" from their previous levels
    for (const i of range(1, tiers.length))
        {
            let prevTier = tiers[i-1];
            let tier = tiers[i];
            if (tier in cooldowns && cooldowns[tier] == undefined && prevTier in cooldowns && cooldowns[prevTier] != undefined)
                cooldowns[tier] = cooldowns[prevTier]
        }

    return cooldowns
}

function getMonsterById(id) {
    for (const monster of Object.values(monsters)) {
        if (monster.Id == id)
            return monster;
    }

    return undefined;
}

export async function loadItems() {

    let items = [];

    // Filter and map items
    for (const card of Object.values(cards)) {

        // Filter
        if (card["Type"] != "Item")
            continue

        // Basic mappings
        let item = {
            id: card["Id"],
            name: card["Localization"]["Title"]["Text"],
            type: card["Type"],
            size: card["Size"],
            heroes: card["Heroes"],
            startingTier: card["StartingTier"],
            tags: card["Tags"],
            hiddenTags: card["HiddenTags"],
            activeTooltops: card["Localization"]["Tooltips"].filter(tooltip => tooltip["TooltipType"] == "Active" && tooltip["Content"]["Text"]).map(tooltip => formatTooltip(tooltip["Content"]["Text"], card)),
            passiveTooltops: card["Localization"]["Tooltips"].filter(tooltip => tooltip["TooltipType"] == "Passive" && tooltip["Content"]["Text"] != null).map(tooltip => formatTooltip(tooltip["Content"]["Text"], card)),
            cooldowns: formatSimpleAttributes(Object.fromEntries(Object.entries(card["Tiers"]).map(([key, tier]) => [key, tier["Attributes"]["CooldownMax"]]))),
            buyPrice: formatSimpleAttributes(Object.fromEntries(Object.entries(card["Tiers"]).map(([key, tier]) => [key, tier["Attributes"]["BuyPrice"] ?? 0]))),
            sellPrice: formatSimpleAttributes(Object.fromEntries(Object.entries(card["Tiers"]).map(([key, tier]) => [key, tier["Attributes"]["SellPrice"] ?? 0]))),
        };

        // Append item
        items.push(item);
    }

    return items;
}

export async function loadMonsterEncounters() {

    let monsterEncounters = [];

    // Filter and map items
    for (const card of Object.values(cards)) {

        // Filter
        if (card["Type"] != "CombatEncounter")
            continue

        // Get assoiated combatant
        const monster = getMonsterById(card["CombatantType"]["MonsterTemplateId"])
        if (!monster)
        {
            console.log(`Warn: Monster not found for encounter: ${card["Localization"]["Title"]["Text"]}`);
            continue
        }

        // Basic mappings
        let encounter = {
            id: card["Id"],
            name: card["Localization"]["Title"]["Text"],
            type: card["Type"],
            heroes: card["Heroes"],
            tags: card["Tags"],
            hiddenTags: card["HiddenTags"],
            rewardCombatGold: card["RewardCombatGold"],
            rewardVictoryExperience: card["RewardVictory"]["ExperienceReward"],
            isSingleSpawn: card["IsSingleSpawn"],
            health: monster["Player"]["Attributes"]["HealthMax"],
            level: monster["Player"]["Attributes"]["Level"],
        };

        // Append item
        monsterEncounters.push(encounter);
    }

    return monsterEncounters;
}

export async function loadSkills() {

    let skills = [];

    // Filter and map items
    for (const card of Object.values(cards)) {

        // Filter
        if (card["Type"] != "Skill")
            continue

        // Basic mappings
        let skill = {
            id: card["Id"],
            name: card["Localization"]["Title"]["Text"],
            type: card["Type"],
            heroes: card["Heroes"],
            startingTier: card["StartingTier"],
            tags: card["Tags"],
            hiddenTags: card["HiddenTags"],
            passiveTooltops: card["Localization"]["Tooltips"].filter(tooltip => tooltip["TooltipType"] == "Passive" && tooltip["Content"]["Text"] != null).map(tooltip => formatTooltip(tooltip["Content"]["Text"], card)),
            buyPrice: formatSimpleAttributes(Object.fromEntries(Object.entries(card["Tiers"]).map(([key, tier]) => [key, tier["Attributes"]["BuyPrice"] ?? 0]))),
            sellPrice: formatSimpleAttributes(Object.fromEntries(Object.entries(card["Tiers"]).map(([key, tier]) => [key, tier["Attributes"]["SellPrice"] ?? 0]))),
        };

        // Append item
        skills.push(skill);
    }

    return skills;
}
