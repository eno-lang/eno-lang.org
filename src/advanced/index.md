# Advanced Features

This page describes five additional types of lines that you should get to know
if you use eno a lot, edit very complex documents, use it for very technical
usecases, or for completeness sake, if you just want to know all there is to
know about the eno format - you can either watch the video (about 11 minutes) or read the written version in about 5-15 minutes, depending on prior
experience with the concepts explained, they both cover the same topics.

<video controls src="advanced.mp4"></video>

## Copying

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

## Dictionaries

```eno
color ratings:
green = 3
red = 4
blue = 1
```

Documentation coming up in the next days!

## Appending

```eno
command:
| ffmpeg -i input.mov
\        -vf deinterlace
\        output.mp4
| cp output.mp4 /external/deployed.mp4
| rm output.mp4
```

Documentation coming up in the next days!

## Deep copying

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

## Escaping

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
You might have wondered how an escape can be escaped, this is achieved by using two backticks around the name that is itself wrapped in (single) backticks, and leaving spaces so it does not look like three backticks. (these spaces on the outside are not included in the name though)
