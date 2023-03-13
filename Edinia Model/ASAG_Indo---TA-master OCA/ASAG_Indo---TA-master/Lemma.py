from spellchecker import SpellChecker
import pickle 

with open('Lemmatization/rootlist.pkl', 'rb') as f:
    rootlist = pickle.load(f)
# import morph_analyzer as ma
from Lemmatization import morph_analyzer as ma
# Buat kamus daripada MALINDO Morph
with open("Lemmatization/malindo_dic_20221221.tsv", "r", encoding="utf-8") as f: #Gunakan versi terkini MALINDO Moprh
    katakata = []
    for l in f:
        items = l.strip().split("\t")
        # print(items)
        if not items[0].startswith("ex-"): #bahagian yg sudah diperiksa manusia sahaja
            katakata.append(tuple(items[1:11])) # sumber, dasar, lema 

kamus = dict()
for kata in katakata:
    surface = kata[1]
    if not surface in kamus.keys():
        kamus[surface] = []
    kamus[surface].append(kata)

def analisis(w, Indo=True, n=5):
    try:
        return kamus[w][:n]
    except:
        return list(ma.morph(w, rootlist, Indo, n))
        
def lemmatization(sentence):
    lemma = []
    hasil_lemma = []
    for token in sentence:
        analyze = analisis(token)
        for i in analyze:
            if len(i)==9:
                hasil_lemma.append(analyze[0][8].split('@')[0].replace('+', ' '))
            else:
                hasil_lemma.append(analyze[0][0].split('@')[0].replace('+', ' '))
    sentence = " ".join(hasil_lemma)
    hasil_lemma = sentence.split()
    # print("Hasil lemma : ", hasil_lemma)
    return hasil_lemma