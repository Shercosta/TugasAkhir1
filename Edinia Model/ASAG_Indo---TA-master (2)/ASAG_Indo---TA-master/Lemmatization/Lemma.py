from spellchecker import SpellChecker
import pickle 

with open('Lemmatization/rootlist.pkl', 'rb') as f:
    rootlist = pickle.load(f)
import morph_analyzer as ma

with open("Lemmatization/malindo_dic_20221221.tsv", "r", encoding="utf-8") as f:
    katakata = []
    for l in f:
        items = l.strip().split("\t")
        if not items[0].startswith("ex-"):
            katakata.append(tuple(items[1:11]))

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
    for token in sentence :
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