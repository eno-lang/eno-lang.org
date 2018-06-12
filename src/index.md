# eno

**eno** is a structured data notation language for everyone.

```eno
# Le Demo

Un saludo en español: Hola
A greeting in english: Hello

## Films

魔女の宅急便:
Rating = 5 Stars

Los amantes del círculo polar:
Rating = ⭐⭐⭐⭐⭐   
```

## Want to learn more about how eno works? 

The two-part video guide (or alternatively also as text) at
[eno-lang.org/write](https://eno-lang.org/write/) covers everything there is to
know about the eno notation language, and you'll be able to author any content
you can think of within a few minutes.

Visit [eno-lang.org/write](https://eno-lang.org/write/) for an introduction.

```eno
> A more technical usecase

command:
| ./configure -foo
\             --format bar
\             --hex #bc
\             out.tmpl
| sudo make
| sudo make install

-- json payload
{
  "result": 200
}
-- json payload
```

## Interested in developing your application or website with eno?

The eno libraries for [JavaScript](https://eno-lang.org/javascript/),
[Python](https://eno-lang.org/python/) and [Ruby](https://eno-lang.org/ruby/)
(more on the roadmap) offer fast, robust, dependency-free, and
thoroughly documented parser implementations in popular languages. By using the
eno API you get structural and type safety for all your data - programmatically
and on the fly, without ever writing a schema - as well as carefully designed,
fully localized user errors with rich metadata for easy and seamless
integration into apps, websites, plugins, editors, IDEs, you name it.

Visit [eno-lang.org/develop](https://eno-lang.org/develop/) for an overview.

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

For more information on eno's design philosophy and goals checkout this [README](https://github.com/eno-lang/eno/blob/master/README.md)
