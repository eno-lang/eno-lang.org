# Learn eno

This guide, which is structured in two parts, covers everything you need to know to understand and edit any eno document you will ever encounter.

*The essential features* describes five important types of lines you will find in eno documents that you absolutely should know about - reading time about 5 minutes.

*The extended features* describes five additional types of lines that you should get to know if you use eno a lot, author very complex documents, use it for very technical usecases, or for completeness sake, if you just want to know all there is to know about the eno format - reading time about 5-15 minutes, depending on prior experience with the concepts explained.

## The essential features

### Comments

Every line starting with `>` marks a comment line, in which any text may appear. The computer discards these lines when reading the file, so they are there for us to make notes and leave hints for others that might read the document.

```eno
> This is a comment !@#$%^&* :)
```

### Assigning values

At its core eno lets us write down values, the simplest form being:

```eno
Current Temperature: Quite pleasant
```

With this we specify a pair of a name and a value, the name being "Current temperature" and the value being "Quite pleasant". In the majority of cases, the name (here "Current Temperature") will come from a template already, so as a user we usually just concern ourselves with editing the values and a friendly developer takes care of specifying the names for us. :)

Some other examples:

```eno
Last Name: Schneider
Website: www.anna-schneider.de
Profession: Freelance graphics artist
```

### No value

If we don't want to specify a value, we just leave the right side empty:

```eno
More information:
```


### Lists of values

If we want to assign multpiple values to a name, it looks like this:

```eno
Shopping list:
- Bread
- Yoghurt
- Bananas (not too ripe)
```

An empty list looks like a regular empty value:

```eno
Shopping list:
```

### Values that span multiple lines

If we want to assign multiple lines to a name, we do it like this:

```eno
-- Long Description
The previous line marks a block, whose content starts with this line.

Until the line that marks the begin of the block appears a second time,
we can write any content we want, leave any number of lines empty ...

... and so on

With "--" we tell eno that we want to start a text block, and the text
right next to the two dashes on that same line again is the name (in this
case "Long Description") that provides a context to our block of text.

Heads up now - in the next line the block ends!
-- Long Description
```

### Sections

Now let's group values in a section:

```eno
# Contact data

Telephone: +43 699 104734953
Email: anna.schneider@anna-schneider.de
```

This assigns all name-value pairs that follow after the begin of the section "Contact data" to that section. It is also possible to create any number of sub-sub-(and so on)-sections:

```eno
# Contact data

## Telephone numbers

### Anna

Landline: +43 1 0468648
Mobile: +43 699 104734953

### Uwe

Landline: +43 1 0468648
Mobile: +43 699 104734953
```

And with this you already know everything you need to edit any `.eno` files you might encounter! To wrap things up, here's another small demonstration that combines all of the possibilities explained above:

```eno
# Profile

Name: John Doe
Hair color: brown/gray
Age:
Hobbies:
- Fishing
- Horse-riding

-- Quote
I read the eno guide and everything made sense,
except this non-sensical example text here.
-- Quote

## Friends

False friends:

Close friends:
- Jane Doe
- Jean Doe

Casual acquaintances:
- John Dear
```

## The extended features

### Copying

eno works very well for authoring content in multiple languages, imagine the following document layout for a blog post:

```eno
# English

title: FAQ
permalink: faq

-- text
Here you find answers to frequently asked questions:
...
-- text
```

If we just wanted to duplicate that page for another language, we can write the following line to do just that:

```eno
# German < English
```

This creates a section with the name "German" and copies everything that exists in the section "English" over to that new section.

As in this case "FAQ" is the same in german and english we only would need to replace the text, which we can do like this:

```eno
# German < English

-- text
Hier findest du Antworten auf oft gestellte Fragen:
...
-- text
```

By copying we get all fields from the english section, and by specifying a new `text` we are overwriting only that specific element, leaving the copied `title` and `permalink` intact.

### Dictionaries

```eno
color ratings:
green = 3
red = 4
blue = 1
```

Documentation coming up in the next days!

### Appending

```eno
command:
| ffmpeg -i input.mov
\        -vf deinterlace
\        output.mp4
| cp output.mp4 /external/deployed.mp4
| rm output.mp4
```

Documentation coming up in the next days!

### Deep copying

```eno
# default
id:
## settings
hyperservice: disabled

# production << default
id: prod
## settings
ultraservice: enabled
```

Documentation coming up in the next days!

### Escaping

Let's assume someone wrote an eno document describing which clothing to wear at different temperatures:

```eno
30 degrees celsius: Swimming trunks
10 degrees celsius: Warm pullover and windjacket
`-10 degrees celsius`: A very warm coat
```

You'll notice that something is different in the third line: The `-10 degrees celsius` has been put between two backticks ( `` ` `` ).

Here's why:  
`-10 degrees celsius` starts with a `-`, and in eno every line starting with a `-` is interpreted as a *list item* as we learned before, therefore we need some way to say that we really mean "minus 10 degrees celsius" and not "10 degrees celsius" as an item in a list.

This is a universal concept in computing called "escaping", and lets us write down things that would otherwise be interpreted differently, a bit like telling a friend you're not being ironic when you just said something that sounded awfully ironic.

Here are some more examples of escaping in eno:

```eno
`https://eno-lang.org/`: The eno website
```
Every field in eno follows the pattern `name: value`, but in this case our name `https://eno-lang.org/` contains a `:` already, therefore we need to escape it.

```eno
`` `hypothetical` ``: The word "hypothetical" inside backticks
```
You might have wondered how an escape can be escaped, this is achieved by using two backticks around and the name that is itself wrapped in (single) backticks, and leaving a space so it does not look like three backticks.
