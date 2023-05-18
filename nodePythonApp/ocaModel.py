# %%
import json
import math
from numpy.linalg import norm
import matplotlib.pyplot as plt
import numpy as np
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.tokenize.treebank import TreebankWordDetokenizer
import pandas as pd
import re
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import (
    StopWordRemoverFactory,
    StopWordRemover,
    ArrayDictionary,
)
import string
from string import digits
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import mean_absolute_error as mae
from sklearn.metrics import cohen_kappa_score as qwk
from sklearn.metrics import mean_absolute_percentage_error as mape
from sklearn.pipeline import Pipeline
from spell import spell_check

# from Lemma import lemmatization
from textblob import TextBlob

# %%
text1 = input("Text 1")
text2 = input("Text 2")

# %%
data = pd.DataFrame([text2])
data.columns = ["Teks 2"]
data["Teks 1"] = text1

# %%
data

# %%
print("Text 1: ", text1)
print("Text 2: ", text2)


# %%
# --------------------------------case folding---------------------------------
def case_folding(text):
    pattern = r"[" + string.punctuation + "]"
    punct = re.sub(pattern, " ", str(text))
    case_fold = punct.lower()
    return case_fold


def spellcheck(text):
    text = spell_check(text)
    return text


def tokenization(text):
    tokens = re.split(" ", text)
    return tokens


def remove_digits(text):
    text = [item for item in text if item.isalpha()]
    return text


sw = nltk.corpus.stopwords.words("indonesian")


def remove_SW(text):
    text = [item for item in text if not item in sw]
    return text


factory = StemmerFactory()
stemmer = factory.create_stemmer()


def stemming(text):
    text = [stemmer.stem(item) for item in text]
    return text


def lemma(text):
    text = lemmatization(text)
    return text


# %% [markdown]
# ## Pre-Processing

# %% [markdown]
# ### Case folding

# %%
caseFoldText2 = case_folding(text2)
caseFoldText1 = case_folding(text1)

print(caseFoldText2)
print(caseFoldText1)

# %% [markdown]
# ### Spell check

# %%
spellText2 = spell_check(caseFoldText2)
spellText1 = spell_check(caseFoldText1)

# print(spellText2)
print("Sebelum: ", text1, "\n")
print("Sesudah:", spellText1)

# %% [markdown]
# ### Tokenization

# %%
tokenText2 = tokenization(spellText2)
tokenText1 = tokenization(spellText1)
tokenText2 = remove_digits(tokenText2)
tokenText1 = remove_digits(tokenText1)

print(tokenText2)
print(tokenText1)

# %%
filterText2 = remove_SW(tokenText2)
filterText1 = remove_SW(tokenText1)

print(filterText2)
print(filterText1)

# %% [markdown]
# ### Stemming

# %%
stemmedText2 = stemming(filterText2)
stemmedText1 = stemming(filterText1)

print(stemmedText2)
print(stemmedText1)

# %% [markdown]
# ## TF-IDF + Cosine + Score


# %%
def term(text1, text2):
    for i in text1:
        if i == "":
            text1.remove("")
    for i in text2:
        if i == "":
            text2.remove("")

    BoWtext1 = set(text1)
    BoWtext2 = set(text2)

    uniqueWords = BoWtext1.union(BoWtext2)
    # print(uniqueWords)

    wordsLengthText1 = dict.fromkeys(uniqueWords, 0)
    for word in text1:
        wordsLengthText1[word] += 1

    wordsLengthText2 = dict.fromkeys(uniqueWords, 0)
    for word in text2:
        wordsLengthText2[word] += 1

    # print('Unique words', wordsLengthText2)

    term = pd.DataFrame([wordsLengthText1, wordsLengthText2])
    term = term.transpose()
    term.columns = ["TFext1", "TFext2"]

    # display(term)

    DFtext1 = dict.fromkeys(uniqueWords, 0)
    for word in BoWtext1:
        DFtext1[word] += 1

    DFtext2 = dict.fromkeys(uniqueWords, 0)
    for word in BoWtext2:
        DFtext2[word] += 1

    term["DFext1"] = DFtext1.values()
    term["DFext2"] = DFtext2.values()

    DF = []
    for i in range(len(uniqueWords)):
        DF.append(term["DFext1"][i] + term["DFext2"][i])
    term["DF"] = DF
    # display(term)

    idfDict = []

    for i in range(len(term["DF"])):
        idfDict.append(math.log10(2 / (term["DF"][i] + 1)))
        # print(idfDict)
    term["IDF"] = idfDict

    # display(term)

    tfidfText1 = []
    tfidfText2 = []
    for i in range(len(uniqueWords)):
        tfidfText1.append(term["TFext1"][i] * term["IDF"][i])
        tfidfText2.append(term["TFext2"][i] * term["IDF"][i])

    term["TF IDF 1"] = np.array(tfidfText1)
    term["TF IDF 2"] = np.array(tfidfText2)

    cosine = np.dot(tfidfText1, tfidfText2) / (
        np.linalg.norm(tfidfText1) * np.linalg.norm(tfidfText2)
    )

    if math.isnan(cosine):
        cosine = 0

    print(cosine)
    print(len(term))
    # print('Skor: ', round((cosine*100),2))
    # print(len(term))

    return term


# %%
term(tokenization(text1), tokenization(text2))

# %%
term(stemmedText2, stemmedText1)

# %% [markdown]
# ## Norm?

# %%
import math
from numpy.linalg import norm


def term_ori(text1queries, text2queries):
    # --------------------term-----------------
    print(len(text1queries))
    print(len(text2queries))
    BoWtext1 = set(text1queries)
    BoWtext2 = set(text2queries)
    uniqueWords = BoWtext1.union(BoWtext2)

    # -----term frequency of word in doc-------
    wordsLengthText1 = dict.fromkeys(uniqueWords, 0)
    for word in text1queries:
        wordsLengthText1[word] += 1

    wordsLengthText2 = dict.fromkeys(uniqueWords, 0)
    for word in text2queries:
        wordsLengthText2[word] += 1

    # print(wordsLengthText2)
    term = pd.DataFrame([wordsLengthText1, wordsLengthText2])
    term = term.transpose()
    term.columns = ["term_q", "term_ans"]

    # --------------term frequency (TF)---------------
    tfQ = {}
    tfA = {}

    bagOfWordsCount = len(text1queries)
    # tf Kunci Jawaban
    for word, count in wordsLengthText1.items():
        tfQ[word] = count / float(bagOfWordsCount)

    # tf Jawaban
    for word, count in wordsLengthText2.items():
        if len(text2queries) == 0:
            tfA[word] = 0
        else:
            tfA[word] = count / float(len(text2queries))

    term["TFext1"] = tfQ.values()
    term["TFext2"] = tfA.values()

    DFtext1 = dict.fromkeys(uniqueWords, 0)
    for word in BoWtext1:
        DFtext1[word] += 1

    DFtext2 = dict.fromkeys(uniqueWords, 0)
    for word in BoWtext2:
        DFtext2[word] += 1

    DF = []
    for i in range(len(uniqueWords)):
        DF.append(list(DFtext1.values())[i] + list(DFtext2.values())[i])
    term["DF"] = DF

    # -------------------IDF---------------------------
    N = len([wordsLengthText1, wordsLengthText2])

    # idfDict = dict.fromkeys([wordsLengthText1, wordsLengthText2][0].keys(), 0)
    # for document in [wordsLengthText1, wordsLengthText2]:
    #     for word, val in document.items():
    #         if val > 0:
    #             idfDict[word] += 1

    # for word, val in idfDict.items():
    #     idfDict[word] = math.log(N+1 / float(val+1))

    idf = []
    for i in range(len(DF)):
        idf.append(math.log10(N / (DF[i] + 1)))
        # print(val)

    term["IDF"] = idf

    # -------------------TF-IDF---------------------
    tfidfText1 = []
    tfidfText2 = []

    for i in range(len(uniqueWords)):
        tfidfText1.append(list(tfQ.values())[i] * idf[i])
        tfidfText2.append(list(tfA.values())[i] * idf[i])

    # tfidfText1 = list(tfidfText1)
    # tfidfText2 = list(tfidfText2)
    term["TF_IDF Q"] = tfidfText1
    term["TF_IDF A"] = tfidfText2

    cosine = np.dot(tfidfText1, tfidfText2) / (
        np.linalg.norm(tfidfText1) * np.linalg.norm(tfidfText2)
    )
    print(len(tfidfText2))
    print(cosine)
    print("Skor: ", round((cosine * 100), 2))
    global SkorSCT
    SkorSCT = str(round((cosine * 100), 2))

    return term


# %%
term_ori(text2.split(), text1.split())

# %%
print(stemmedText2)
print(stemmedText1)

# %%
term_ori(stemmedText2, stemmedText1)

# %%
newfile = open("Plagiatkah.json", "w")

newfile.write(
    '{ "Text 1": "'
    + caseFoldText1
    + '", \n"Tekt 2": "'
    + caseFoldText2
    + '", \n"Kemiripan": "'
    + SkorSCT
    + '"}'
)

newfile.close()
