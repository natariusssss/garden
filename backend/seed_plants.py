from sqlalchemy.orm import Session
from models import Plant
plants_data = [
    {
        "code": "birch",
        "name": "Береза",
        "description": "Светлое дерево с тонким белым стволом, темными отметинами на коре и легкой зеленой листвой.",
        "rarity": "common",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "thuja",
        "name": "Туя",
        "description": "Стройное хвойное растение с плотной зеленой кроной, мелкой хвоей и аккуратным вертикальным силуэтом.",
        "rarity": "common",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "maple",
        "name": "Клен",
        "description": "Декоративное дерево с выразительной кроной, резными листьями и мягко раскинутыми ветвями.",
        "rarity": "common",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "oak",
        "name": "Дуб",
        "description": "Мощное дерево с толстым стволом, широкой кроной, крепкими ветвями и плотными дубовыми листьями.",
        "rarity": "common",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "rose",
        "name": "Роза",
        "description": "Пышный цветочный куст с тонкими стеблями, зелеными листьями и яркими розовыми бутонами.",
        "rarity": "epic",
        "tree_type": "цветок",
        "image_url": None,
    },
    {
        "code": "maple_japan",
        "name": "Японский клен",
        "description": "Невысокое декоративное дерево с тонким стволом, изящными ветвями и резной красной листвой.",
        "rarity": "epic",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "magnolia",
        "name": "Магнолия",
        "description": "Элегантное цветущее дерево с тонкими ветвями, крупными зелеными листьями и нежными светлыми цветами.",
        "rarity": "legendary",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "baobab",
        "name": "Баобаб",
        "description": "Необычное массивное дерево с очень толстым стволом, короткими ветвями и компактной верхней кроной.",
        "rarity": "rare",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "hydrangea",
        "name": "Гортензия",
        "description": "Пышный декоративный куст с крупными зелеными листьями и округлыми цветочными соцветиями.",
        "rarity": "epic",
        "tree_type": "кустарник",
        "image_url": None,
    },
    {
        "code": "lilac",
        "name": "Сирень",
        "description": "Кустарник с тонкими ветвями, густой зеленой листвой и мягкими сиреневыми цветочными кистями.",
        "rarity": "epic",
        "tree_type": "кустарник",
        "image_url": None,
    },
    {
        "code": "orchid",
        "name": "Орхидея",
        "description": "Изящный цветок с тонким стеблем, плавными листьями и крупными мягкими лепестками.",
        "rarity": "rare",
        "tree_type": "цветок",
        "image_url": None,
    },
    {
        "code": "ginkgo",
        "name": "Гинкго",
        "description": "Древнее дерево с аккуратным стволом, веерообразными листьями и теплой желто-зеленой кроной.",
        "rarity": "rare",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "swamp_cypress",
        "name": "Болотный кипарис",
        "description": "Высокое хвойное дерево с мягкой рыжеватой кроной, тонкой хвоей и вытянутым силуэтом.",
        "rarity": "rare",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "sequoia",
        "name": "Секвойя",
        "description": "Гигантское хвойное дерево с мощным прямым стволом, плотной кроной и массивным вертикальным силуэтом.",
        "rarity": "rare",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "palm",
        "name": "Пальма",
        "description": "Тропическое дерево с высоким тонким стволом, крупными раскидистыми листьями и кокосами у кроны.",
        "rarity": "rare",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "sakura",
        "name": "Сакура",
        "description": "Нежное дерево с изогнутым стволом, тонкими ветвями и пышной розовой цветущей кроной.",
        "rarity": "legendary",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "willow",
        "name": "Ива",
        "description": "Высокое дерево с мягким силуэтом, длинными свисающими ветвями и узкой зеленой листвой.",
        "rarity": "legendary",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "cercis",
        "name": "Церцис",
        "description": "Декоративное дерево с изящным стволом, округлыми зелеными листьями и мягкими розово-сиреневыми цветами.",
        "rarity": "legendary",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "lotos",
        "name": "Лотос",
        "description": "Водное растение с широкими округлыми листьями, тонкими стеблями и крупным светлым цветком.",
        "rarity": "rare",
        "tree_type": "цветок",
        "image_url": None,
    },
    {
        "code": "rainbow_eucalyptus",
        "name": "Радужный эвкалипт",
        "description": "Высокое дерево с гладким многоцветным стволом, вытянутой кроной и длинными зелеными листьями.",
        "rarity": "legendary",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "wise_oak",
        "name": "Мудрый дуб",
        "description": "Старинный дуб с крепким стволом, выразительными ветвями и густой плотной листвой.",
        "rarity": "legendary",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "lily",
        "name": "Лилия",
        "description": "Изящный цветок с тонким зеленым стеблем, вытянутыми листьями и крупными мягкими лепестками.",
        "rarity": "epic",
        "tree_type": "цветок",
        "image_url": None,
    },
    {
        "code": "dragon",
        "name": "Драконово дерево",
        "description": "Декоративное дерево с разветвленным стволом, плотной зонтичной кроной и узкими зелеными листьями на концах ветвей.",
        "rarity": "epic",
        "tree_type": "дерево",
        "image_url": None,
    },
    {
        "code": "jacaranda",
        "name": "Жакаранда",
        "description": "Цветущее дерево с тонким стволом, мягкой раскидистой кроной и пышными сиренево-фиолетовыми цветами.",
        "rarity": "legendary",
        "tree_type": "дерево",
        "image_url": None,
    },
]


def seed_plants(db: Session):
    for item in plants_data:
        plant=db.query(Plant).filter(Plant.code == item["code"]).first()
        if plant:
            plant.name = item["name"]
            plant.description = item["description"]
            plant.rarity = item["rarity"]
            plant.tree_type = item["tree_type"]
            plant.image_url = item["image_url"]
        else:
            db.add(Plant(**item))
    db.commit()

