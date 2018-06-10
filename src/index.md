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

&nbsp;

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

&nbsp;

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
